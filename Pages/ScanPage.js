import React from 'react'
import { View, Text } from 'react-native'

import API from '../Communication/API/API'
import CodeCollection from '../Database/Models/CodeCollection'

import moment from 'moment'
import 'moment/locale/es'

import EventWebSocket from '../Communication/EventBased/EventWebSocket'

export default class ScanPage extends React.Component {
    constructor( props ) {
        super( props )

        this.state = {
            collections: [],
            ws: [],
            validated: 0,
            toValidate: 0
        }
    } 

    async componentWillMount() {
        const { session } = this.props
        let validated = 0;
        let toValidate = 0;
        const typesResponse = await API.get( 'types?session=' + session.id );
        if( typesResponse.ok ) {
            const collections = [];
            const ws = [];
            const types = await typesResponse.json();
            for( let i = 0; i < types.length; types++ ) {
                const type = types[ i ];
                const collection = new CodeCollection( session, type );
                await collection.syncCollection();
                const codeCount = await collection.getCodeCount();
                toValidate += codeCount;
                validated += collection.validated;

                collections.push( collection );
                ws.push( new EventWebSocket( 
                    API.connection,
                    session.id + '-'+session.name+'-'+type.id+'-'+type.type 
                ));
            }

            this.setState({
                toValidate: toValidate, 
                validated: validated, 
                collections: collections, 
                ws: ws
            });
        }
    }

    componentWillUnmount() {
        this.state.ws.forEach( socket => {
            socket.disconnect();
        })
    }

    render() {
        const { session } = this.props
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
                    <Text style={{color:'#666', textAlign: 'center', fontSize:25, marginBottom: 0}}>{this.state.validated}/{this.state.toValidate}</Text>
                </View>
            </View>
        )
    }
}