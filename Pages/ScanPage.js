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
            openCamera: false
        }
    } 

    async componentWillMount() {
        const { session } = this.props
        const typesResponse = await API.get( 'types?session=' + session.id );
        if( typesResponse.ok ) {
            const types = await typesResponse.json();
            const controller = new ConsensusRobustController( session, types );
            await controller.initialize( session, types );

            this.setState({ controller });
        }
    }

    openCamera( value ) {
        this.setState({openCamera: value})
    }

    codeReceived( code ) {
        console.log( code )
        this.openCamera( false )
        this.state.controller.codeScanned( code );
    }

    render() {
        const { session } = this.props
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
                    <Text style={{color:'#666', textAlign: 'center', fontSize:25, marginBottom: 0}}>{0}/{0}</Text>
                </View>
                <Button onPress={() => this.openCamera( true )} title="CÁMARA"/>
                {this.state.lastScanData === null && <View style={{backgroundColor:'#aaa'}}>
                    <Text style={{color:'#777', fontSize: 45, textAlign: 'center'}}>LISTO PARA ESCANEAR</Text>
                </View>} 
            </View>
        )
    }
}