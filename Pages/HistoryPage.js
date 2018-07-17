import React from 'react'
import { ScrollView, View, FlatList, Text, TextInput, Picker } from 'react-native'

import moment from 'moment'
import API from '../Communication/API/API'
import EventWebSocket from '../Communication/EventBased/EventWebSocket'

export default class HistoryPage extends React.Component {    
    constructor( props ) {
        super( props );

        this.state = {
            entries: [],
            levelFilter: -1,
            msgFilter: '',
            userFilter: this.guardUserFilter( '' ),
            isAuth: this.isAuth()
        }

        this.logSocket = new EventWebSocket( API.connection, props.session.id + '-session' );
        this.logSocket.bind( 'log_entry_added', data => {
            const entries = [...this.state.entries, data];
            this.setState({entries: this.sortEntries( entries )});
        });
    }

    isAuth() {
        if( API.me ) {
            return API.me.role.role === 'superadmin' || 
            API.me.role.role === 'admin' || 
            API.me.role.role === 'supervisor';
        }

        return false;
    }

    guardUserFilter( targetFilter ) {
        if( API.me ) {
            if( 
                API.me.role.role === 'superadmin' || 
                API.me.role.role === 'admin' || 
                API.me.role.role === 'supervisor'
            ) {
                return targetFilter;
            }

            return API.me.username; 
        }

        return '';
    }

    componentWillMount() {
        this.fetchLogEntries( this.props.session.id );
    }

    componentWillUnmount() {
        this.logSocket.disconnect();
        this.logSocket = null;
    }

    sortEntries( entries ) {
        return entries.sort( ( a, b ) => {
            const aDate = moment( a.date );
            const bDate = moment( b.date );

            if( aDate.isBefore( bDate ) ) { return 1; }
            if( bDate.isBefore( aDate ) ) { return -1; }
            
            return 0;
        });
    }

    async fetchLogEntries( sessionId ) {
        const apiResponse = await API.get( 'logentries?session='+sessionId );
        if( apiResponse.ok ) {
            let entries = await apiResponse.json();
            entries = this.sortEntries( entries );
            this.setState({entries: entries})
        }
    }

    filterEntries( entries ) {
        return entries.filter( entry => {
            let levelFilter = true;
            if( this.state.levelFilter !== -1 ) {
                levelFilter = entry.level === this.state.levelFilter;
            }
            let msgFilter = entry.msg.includes( this.state.msgFilter.trim() );
            let userFilter = entry.user ? entry.user.username.includes( this.state.userFilter.trim() ) : true;

            return levelFilter && msgFilter && userFilter;
        });
    }

    translateEntryLevel( level ) {
        switch( level ) {
            case 'success': {
                return 'ÉXITO';
            }
            case 'error': {
                return 'ERROR';
            }
            case 'info': {
                return 'INFO';
            }
        }
    }

    getLevelColors( level ) {
        switch( level ) {
            case 'success': {
                return {
                    header: 'green',

                };
            }
            case 'error': {
                return {
                    header: 'red',
                    
                };
            }
            case 'info': {
                return {
                    header: 'blue',
                    
                };
            }
        }
    }
 
    render() {
        const { session } = this.props
        const recint = session.recint === Object( session.recint )?session.recint.recint:session.recint
        const filteredEntries = this.filterEntries( this.state.entries )
        return(
            <ScrollView>
                <View>
                    <View style={{backgroundColor:'#ddd', borderBottomWidth: 0.5, borderBottomColor:'#ccc'}}>
                        <Text style={{color:'#555', fontSize: 15, textAlign: 'center'}}>{session.name}</Text>
                        <Text style={{color:'#999', fontSize: 5, textAlign: 'center'}}>{session.location}</Text>
                        <Text style={{color:'#999', fontSize: 5, textAlign: 'center'}}>{recint}</Text>
                        <Text style={{color:'#999', fontSize: 5, textAlign: 'center'}}>{moment(session.date).locale('es').format( 'dddd DD MMMM YYYY HH:mm' )}</Text>
                    </View> 
                </View>
                <View>
                    <Picker
                        selectedValue={this.state.levelFilter}
                        onValueChange={( value, index ) => this.setState({levelFilter: value})}
                    >
                        <Picker.Item label="SELECCIONE TIPO" value={-1} />
                        <Picker.Item label={'EXITO'} value={'success'} />
                        <Picker.Item label={'ERROR'} value={'error'} />
                        <Picker.Item label={'INFO'}  value={'info'} />
                    </Picker>
       
                    <Text style={{color: '#333', textAlign: 'center'}}>INICIADO POR</Text>
                    <TextInput editable={this.state.isAuth} onChangeText={(text) => this.setState({userFilter: text})} value={this.guardUserFilter( this.state.userFilter )}/>

                    <Text style={{color: '#333', textAlign: 'center'}}>EL MENSAJE CONTIENE</Text>
                    <TextInput onChangeText={(text) => this.setState({msgFilter: text})} value={this.state.msgFilter}/>

                    <Text style={{textAlign:'center', fontWeight: 'bold'}}>{filteredEntries.length} sucesos </Text>
                </View>
                <FlatList 
                    data={filteredEntries}
                    keyExtractor={(item) => item.id}
                    renderItem={(item) => {
                        const entry = item.item
                        const colors = this.getLevelColors( entry.level )
                        return(
                            <View style={{padding:5, backgroundColor:'#444'}}>
                                <View style={{backgroundColor:'#666'}}>
                                    <Text style={{textAlign: 'center', fontSize: 10, color:'#ddd'}}>{entry.user ? entry.user.username : ''}</Text>
                                </View>
                                <View style={{backgroundColor:'#ddd'}}>
                                    <Text style={{textAlign:'center', fontSize: 10, color: '#999'}}>{moment(entry.date).format( 'HH:mm:ss DD/MM/YYYY' )}</Text>
                                </View>
                                <View style={{backgroundColor: colors.header}}>
                                    <Text style={{textAlign:'center', fontSize: 7, color: 'white'}}>{ this.translateEntryLevel( entry.level )}</Text>
                                </View>                                
                                <View style={{backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#ccc'}}>
                                    <Text style={{textAlign:'center', fontSize: 15, fontWeight: 'bold', color: colors.header}}>{entry.msg}</Text>
                                </View>                                
                            </View>
                        )
                    }}
                />    
            </ScrollView>
        )
    }
}