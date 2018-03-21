import React from 'react';

import { Alert, View, Text, TextInput, StyleSheet, Button, Picker } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Connection from '../Communication/Connection';
import API from '../Communication/API/API';
import config from '../env'

export default class LoginPage extends React.Component {
    constructor( props ) {
        super( props )

        this.state = {
            protocol: 'http',
            host: '192.168.1.12',
            port: '3005',
            username: 'root',
            password: 'root',
            connectDisabled: false,
            logged: false
        }
    }

    handleFieldChange( field, value ) {
        const state = {...this.state}
        state[ field ] = value
        this.setState(state)
    }

    async login() {
        this.connectButtonDisabled( true )

        API.updateConnection( new Connection( this.state.protocol, this.state.host, this.state.port, API.basePath ) );
        try {
            await API.attemptLogin({
                username: this.state.username,
                password: this.state.password,
                client_id: config.auth.client_id,
                client_secret: config.auth.client_secret,
                grant_type: config.auth.grant_type
            });
            
            this.goToSessions()
            
        } catch( error ) {
            Alert.alert(
                'ERROR DE CONEXIÓN',
                'No se pudo conectar. Compruebe los datos de conexión o consulte a un administrador',
                [
                    {text: 'ACEPTAR', onPress: () => {}},
                ],
                { cancelable: true }
            )
        }

        this.connectButtonDisabled( false )
    }

    connectButtonDisabled( value ) {
        this.setState({connectDisabled: value})
    }

    goToSessions() {
        Actions.popAndPush( 'sessions' );
    }

    render() {
        return(
            <View style={{backgroundColor:'#ccc'}}>
                <View style={{backgroundColor:'#aaa'}}>
                    <Text style={{color: '#eee', textAlign: 'center', fontSize: 30}}>CONEXIÓN</Text>
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
                    <Text style={{color: '#333', textAlign: 'center'}}>HOST</Text>
                    <TextInput style={{textAlign: 'center'}} onChangeText={(text) => this.handleFieldChange('host', text)} value={this.state.host}/>
                    <Text style={{color: '#333', textAlign: 'center'}}>PUERTO</Text>
                    <TextInput style={{textAlign: 'center'}} keyboardType="numeric" onChangeText={(text) => this.handleFieldChange('port', text)} value={this.state.port}/>
                    <Text style={{color: '#333', textAlign: 'center'}}>USUARIO</Text>
                    <TextInput style={{textAlign: 'center'}} onChangeText={(text) => this.handleFieldChange('username', text)} value={this.state.username} />
                    <Text style={{color: '#333', textAlign: 'center'}}>CONTRASEÑA</Text>
                    <TextInput style={{textAlign: 'center'}} secureTextEntry={true} onChangeText={(text) => this.handleFieldChange('password', text)} value={this.state.password}/>
                </View>
                <Button 
                    disabled={this.state.connectDisabled}
                    color="#bbb"
                    title="CONECTAR"
                    accesibilityLabel="Conecta con la API"
                    onPress={() => this.login()}
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