import React from 'react'
import { Button, View, Text } from 'react-native'

import ConsensusRobustController from '../Consensus/Controllers/ConsensusRobustController'
import CameraScanner from '../Components/CameraScanner/CameraScanner'
import API from '../Communication/API/API'
import moment from 'moment'
import 'moment/locale/es'

export default class ScanPage extends React.Component {
    constructor( props ) {
        super( props )

        this.state = {
            controller: null,
            lastScanData: null,
            openCamera: false,
            totalCodes: 0,
            scanned: 0
        }
    } 

    async componentWillMount() {
        const { session } = this.props
        const typesResponse = await API.get( 'types?session=' + session.id );
        if( typesResponse.ok ) {
            const types = await typesResponse.json();
            const controller = new ConsensusRobustController( this.receiveLastScan.bind( this ) );
            await controller.initialize( session, types );

            this.setState({ controller, scanned: controller.validated, totalCodes: controller.codeCount });
        }
    }

    componentWillUnmount() {
        this.state.controller.stop();
        this.state = {
            controller: null,
            lastScanData: null,
            openCamera: false
        };
    }

    openCamera( value ) {
        this.setState({openCamera: value})
    }

    codeReceived( code ) {
        console.log( code )
        this.openCamera( false )
        if(  this.state.controller ) {
            this.state.controller.codeScanned( code );
        }
    }

    receiveLastScan( data ) {
        console.log( 'received last scan' );
        this.setState({ lastScanData: data, scanned: data.verification === 'valid' ? this.state.scanned + 1 : this.state.scanned });
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
            <View>
                <View style={{backgroundColor:'#333'}}>
                    <Text style={{color:'#666', textAlign: 'center', fontSize:10, marginBottom: 0}}>ESCANEANDO COMO</Text>
                    <Text style={{color:'#999', textAlign: 'center', fontSize:25, marginTop: 0}}>{API.me.username}</Text>
                </View>
                <View style={{backgroundColor:'#ddd', borderBottomWidth: 0.5, borderBottomColor:'#ccc'}}>
                    <Text style={{color:'#555', fontSize: 30, textAlign: 'center'}}>{session.name}</Text>
                    <Text style={{color:'#999', fontSize: 10, textAlign: 'center'}}>{session.location}</Text>
                    <Text style={{color:'#999', fontSize: 10, textAlign: 'center'}}>{session.recint}</Text>
                    <Text style={{color:'#999', fontSize: 10, textAlign: 'center'}}>{moment(session.date).locale('es').format( 'dddd DD MMMM YYYY HH:mm' )}</Text>
                </View>
                <View style={{backgroundColor:'#eee', borderBottomWidth: 0.75, borderBottomColor:'#aaa'}}>
                    <Text style={{color:'#999', textAlign: 'center', fontSize:10, marginBottom: 0}}>ESCANEADO</Text>
                    <Text style={{color:'#666', textAlign: 'center', fontSize:25, marginBottom: 0}}>{this.state.scanned}/{this.state.totalCodes}</Text>
                </View>
                <Button onPress={() => this.openCamera( true )} title="CÁMARA"/>
                {this.state.lastScanData === null && <View style={{backgroundColor:'#aaa'}}>
                    <Text style={{color:'#777', fontSize: 45, textAlign: 'center'}}>LISTO PARA ESCANEAR</Text>
                </View>}
                {this.state.lastScanData !== null && this.renderLastScan()} 
            </View>
        )
    }
}