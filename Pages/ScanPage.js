import React from 'react'
import { Button, View, Text, KeyboardAvoidingView } from 'react-native'
import { Actions } from 'react-native-router-flux'

import ConsensusRobustController from '../Consensus/Controllers/ConsensusRobustController'
import CameraScanner from '../Components/CameraScanner/CameraScanner'
import EmbedScanner from '../Components/EmbedScanner/EmbedScanner'
import API from '../Communication/API/API'
import moment from 'moment'
import 'moment/locale/es'

//Interval to refresh the user's session
const AUTO_REFRESH_INTERVAL = 1000 * 60 * 30; //Each 30 minutes
export default class ScanPage extends React.Component {
    constructor( props ) {
        super( props )

        this.autoRefresherId = null
        this.state = {
            fordibben: false,
            controller: null,
            lastScanData: null,
            openCamera: false,
            scanMode: 'E',
            totalCodes: 0,
            scanned: 0,
            connectionStatus: true
        }
    } 

    async componentWillMount() {
        const { session } = this.props
        const typesResponse = await API.get( 'types?session=' + session.id );
        if( typesResponse.ok ) {
            const types = await typesResponse.json();
            if( types.length === 0 ) {
                this.setState({fordibben: true});
                return;
            }
            const controller = new ConsensusRobustController( this.receiveLastScan.bind( this ) );
            controller.connectionStatusListener = this.updateConnectionStatus.bind( this );
            controller.codeAddedListener = ( totalCodes ) => {
                this.setState({totalCodes: totalCodes});
            }
            await controller.initialize( session, types );

            this.setState({ controller, scanned: controller.validated, totalCodes: controller.codeCount });

            this.autoRefresherId = setTimeout( async () => await this.refreshSession(), AUTO_REFRESH_INTERVAL )
        }
    }

    componentWillUnmount() {
        if( this.state.controller ) {
            this.state.controller.stop();
        }
        if( this.autoRefresherId ) {
            clearTimeout( this.autoRefresherId );
        }
        this.state = {
            controller: null,
            lastScanData: null,
            openCamera: false
        };
    }
    
    async refreshSession() {
        try {
            await API.attemptRefresh()
            this.autoRefresherId = setTimeout( 
                async () => await this.refreshSession(), 
                AUTO_REFRESH_INTERVAL 
            )
        } catch( error ) {
            console.error( 'fatal error: bad refresh token while scanning' )
            Actions.replace('/login')
        }
    }

    updateConnectionStatus( value ) {
        this.setState({connectionStatus: value});
    }

    openCamera( value ) {
        this.setState({openCamera: value})
    }

    swithScanMode() {
        this.setState({
            scanMode: this.state.scanMode === 'E' ? 'O' : 'E'
        });
    }

    codeReceived( code ) {
        if( code === null ) {
            return;
        }

        console.log( code + ' ' + this.state.scanMode );
        this.openCamera( false )
        if(  this.state.controller ) {
            this.state.controller.codeScanned( code, this.state.scanMode );
        }
    }

    receiveLastScan( data ) {
        console.log( 'received last scan' );
        this.setState({ lastScanData: data, scanned: this.state.controller.validated });
    }
    
    renderLastScan() {
        const scanData = this.state.lastScanData;

        if( scanData.verification === 'not_valid' ) {
            return(
                <View>
                    <View style={{backgroundColor:'red'}}>
                        <Text style={{textAlign: 'center', fontSize: 40, color: 'white'}}>NO VÁLIDO</Text>
                        <Text style={{textAlign: 'center', fontSize: 20, color: 'white'}}>{scanData.code}</Text>
                        <Text style={{textAlign: 'center', fontSize: 18, color: 'black'}}>{scanData.type}</Text>
                        <Text style={{textAlign: 'center', fontSize: 12, color: 'white'}}>{scanData.name}</Text>
                    </View>
                    <View style={{backgroundColor:'#999'}}>
                        <Text style={{textAlign: 'center', fontSize: 20, color:'#ddd'}}>{scanData.message}</Text>
                    </View>
                </View>
            )
        }

        return(
            <View>
                <View style={{backgroundColor:'green'}}>
                    <Text style={{textAlign: 'center', fontSize: 40, color: 'white'}}>VÁLIDO</Text>
                    <Text style={{textAlign: 'center', fontSize: 20, color: 'white'}}>{scanData.code}</Text>
                    <Text style={{textAlign: 'center', fontSize: 18, color: 'black'}}>{scanData.type}</Text>
                    <Text style={{textAlign: 'center', fontSize: 12, color: 'white'}}>{scanData.name}</Text>
                </View>
            </View>
        )
    }

    render() {
        const { session } = this.props
        if( this.state.fordibben ) {
            return(
                <View style={{backgroundColor:'darkred', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize:30, color:'white'}}>NO TIENE PERMISOS PARA ESCANEAR ESTE EVENTO.</Text>
                </View>
            );
        }
        if( !this.state.controller ) {
            <Text>CARGANDO...</Text>
        }
        if( this.state.openCamera ) {
            return(
                <CameraScanner 
                    onBarCodeRead={({type, data}) => {
                        this.codeReceived( data )
                    }}
                />
            );
        }        

        return(
            <KeyboardAvoidingView>
                <View style={{backgroundColor: this.state.connectionStatus ? 'green' : 'red'}}>
                    <Text style={{textAlign: 'center', fontSize: 20, color: 'white'}}>
                        {this.state.connectionStatus ? 'CONECTADO' : 'SIN CONEXIÓN'}
                    </Text>
                </View>
                <View style={{backgroundColor:'#333'}}>
                   <Text style={{color:'#999', textAlign: 'center', fontSize:10, marginTop: 0}}>{API.me.username}</Text>
                </View>   
                <View style={{backgroundColor:'#ddd', borderBottomWidth: 0.5, borderBottomColor:'#ccc'}}>
                    <Text style={{color:'#555', fontSize: 12, textAlign: 'center'}}>
                        {session.name} ({session.location}) {moment(session.date).locale('es').format( 'DD/MM/YYYY HH:mm' )}
                    </Text>
                </View>                 
                <View> 
                    <Text style={{textAlign:'center'}}> LECTURA </Text>
                    <EmbedScanner onLecture={( code ) => this.codeReceived( code ) }/>
                </View>
                <Button 
                    title="LISTADO" 
                    color="#666" 
                    onPress={() => {
                        Actions.push( 'codelist', {
                            collections: this.state.controller.getCollections()
                        })
                    }}
                />
                {this.state.lastScanData === null && <View style={{backgroundColor:'#aaa'}}>
                    <Text style={{color:'#777', fontSize: 45, textAlign: 'center'}}>LISTO PARA ESCANEAR</Text>
                </View>}
                {this.state.lastScanData !== null && this.renderLastScan()}   
                <Button 
                    title="VER HISTORIA" 
                    color="#666" 
                    onPress={() => {
                        Actions.push( 'history', {
                            session: session
                        })
                    }}
                />       
                <Button color="#aaa" onPress={() => this.openCamera( true )} title="LEER CON CÁMARA"/> 
                <View style={{backgroundColor:'#eee', borderBottomWidth: 0.75, borderBottomColor:'#aaa'}}>
                    <Text style={{color:'#999', textAlign: 'center', fontSize:10, marginBottom: 0}}>ESCANEADO</Text>
                    <Text style={{color:'#666', textAlign: 'center', fontSize:25, marginBottom: 0}}>{this.state.scanned}/{this.state.totalCodes}</Text>
                </View>                            
                <View style={{backgroundColor:'#666'}}>
                    <Text 
                        style={{
                            textAlign:'center', 
                            color:'#ccc', 
                            fontSize: 18
                        }}
                    >
                        MODO ESCANEO: 
                        <Text 
                            style={{
                                color: this.state.scanMode === 'E' ? 'lightgreen':'red',
                                fontSize: 20
                            }}
                        >
                            { this.state.scanMode === 'E' ? ' ENTRADA':' SALIDA' } 
                        </Text>
                    </Text>
                    <Button color="darkgreen" onPress={() => this.swithScanMode()} title="CAMBIAR E/S"/>
                </View>      
            </KeyboardAvoidingView>
        )
    }
}