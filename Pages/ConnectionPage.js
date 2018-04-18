import React from 'react';

import { Alert, View, Text, TextInput, StyleSheet, Button, Picker } from 'react-native';
import { Actions } from 'react-native-router-flux';

import API from '../Communication/API/API';
import Connection from '../Communication/Connection';
import ConnectionConfigCollection from '../Database/Models/ConnectionConfigCollection';

export default class ConnectionPage extends React.Component {
    constructor( props ) {
        super( props )

        this.state = {
            name: '',
            protocol: 'http',
            host: '',
            port: '3005',
            basePath:'',
            selectedConnection: -1,
            connections: []
        }

        this.connectionsDB = new ConnectionConfigCollection();
    }

    componentWillMount() {
        this.fetchConnections();
    }

    async fetchConnections() {
        const connections = await this.connectionsDB.getAll();
        this.setState({connections: connections}); 
    }

    async storeConnectionData() {
        await this.connectionsDB.insert({
            name: this.state.name,
            protocol: this.state.protocol,
            host: this.state.host,
            port: this.state.port,
            basePath: this.basePath
        });
        await this.fetchConnections();
    }

    async deleteConnectionData() {
        await this.connectionsDB.remove( this.state.name );
        await this.fetchConnections();
    }

    loadConnection( connectionIndex ) {
        if( connectionIndex < 0 ) {
            this.setState({
                name: '',
                protocol: 'http',
                host: '',
                port: '3005',
                basePath: ''
            })
            return;
        }
        const connection = this.state.connections[ connectionIndex ];
        this.setState({
            name: connection.name,
            protocol: connection.protocol,
            host: connection.host,
            port: connection.port,
            basePath: connection.basePath
        })
    }

    handleFieldChange( field, value ) {
        const state = {...this.state}
        state[ field ] = value
        this.setState(state)
    }
    
    goToLogin() {
        API.updateConnection( new Connection( this.state.protocol, this.state.host, this.state.port ) );
        Actions.popAndPush( 'login' );
    }

    render() {
        return(
            <View style={{backgroundColor:'#ccc'}}>
                <View style={{backgroundColor:'#aaa'}}>
                    <Text style={{color: '#eee', textAlign: 'center', fontSize: 30}}>CONEXIÓN</Text>
                </View>
                <View>
                    <Text style={{color: '#333', textAlign: 'center'}}>CARGAR DATOS</Text>
                    <Picker
                        selectedValue={this.state.selectedConnection}
                        onValueChange={( value, index ) => {
                            this.handleFieldChange('selectedCollection', value)
                            this.loadConnection( value )
                        }}
                    >
                        <Picker.Item label="SELECCIONAR CONEXIÓN" value={-1} />
                        {this.state.connections.map( (connection, index) => <Picker.Item key={index} label={connection.name} value={index} /> )}
                    </Picker>
                </View>
                <View style={{backgroundColor:'#eee'}}>
                    <Text style={{color: '#333', textAlign: 'center'}}>PROTOCOLO</Text>
                    <Picker
                        selectedValue={this.state.protocol}
                        onValueChange={( value, index ) => this.handleFieldChange('protocol', value)}
                    >
                        <Picker.Item label="HTTP" value="http" />
                        <Picker.Item label="HTTPS" value="https" />
                    </Picker>
                    <Text style={{color: '#333', textAlign: 'center'}}>NOMBRE</Text>
                    <TextInput style={{textAlign: 'center'}} onChangeText={(text) => this.handleFieldChange('name', text)} value={this.state.name}/>
                    <Text style={{color: '#333', textAlign: 'center'}}>HOST</Text>
                    <TextInput style={{textAlign: 'center'}} onChangeText={(text) => this.handleFieldChange('host', text)} value={this.state.host}/>
                    <Text style={{color: '#333', textAlign: 'center'}}>PUERTO</Text>
                    <TextInput style={{textAlign: 'center'}} keyboardType="numeric" onChangeText={(text) => this.handleFieldChange('port', text)} value={this.state.port}/>
                    <Text style={{color: '#333', textAlign: 'center'}}>PREFIJO</Text>
                    <TextInput style={{textAlign: 'center'}} onChangeText={(text) => this.handleFieldChange('basePath', text)} value={this.state.username} />
                </View>
                <Button
                    disabled={this.state.name.trim().length === 0}
                    color="green"
                    title="GUARDAR CONEXIÓN"
                    onPress={async () => await this.storeConnectionData()}
                />
                <Button
                    disabled={this.state.name.trim().length === 0}
                    color="red"
                    title="OLVIDAR CONEXIÓN"
                    onPress={async () => await this.deleteConnectionData()}
                />
                <Button 
                    color="#aaa"
                    title="CONTINUAR"
                    accesibilityLabel="Conecta con la API"
                    onPress={() => this.goToLogin()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue',
    }
});