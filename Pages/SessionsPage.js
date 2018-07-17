import React from 'react';
import { Button, FlatList, StyleSheet, ScrollView, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import API from '../Communication/API/API';
import moment from 'moment';
import 'moment/locale/es'

export default class SessionsPage extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            sessions: []
        }
    }

    async componentWillMount() {
        await this.fetchSessions();
    }

    async fetchSessions() {
        const sessionsResponse = await API.get( 'sessions' );
        if( sessionsResponse.ok ) {
            const sessions = await sessionsResponse.json();
            this.setState({ sessions });
        }
    }
    
    startSession( session ) {
        Actions.push( 'scan', {session} )
    }

    renderHeader() {
        return(
            <Button 
                color="#aaa" 
                title="ACTUALIZAR"
                onPress={() => this.fetchSessions()}
            />
        )
    }

    render() {
        return(
            <ScrollView>
                <FlatList
                    ListHeaderComponent={this.renderHeader()}
                    data={this.state.sessions}
                    keyExtractor={ ( session, index ) => session.id }
                    renderItem={
                        ( item ) => {
                            const session = item.item;
                            const recint = session.recint === Object( session.recint )?session.recint.recint:session.recint
                            return(
                                <View style={styles.container}>
                                    <Text style={styles.nameText}>
                                        {session.name}
                                    </Text>                                
                                    <Text style={styles.otherText}>{moment(session.date).locale('es').format('dddd DD MMMM YYYY HH:mm').toUpperCase()}</Text>
                                    <Text style={styles.otherText}> {session.location} </Text>
                                    <Text style={styles.otherText}> {recint} </Text>
                                    <Button 
                                        color="#999"
                                        onPress={() => this.startSession( session )}
                                        title="ESCANEAR"
                                    />
                                </View>
                            );
                        }
                    }
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#ccc'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 0.25,
        borderColor: '#ccc'
    },
    nameText: {
        textAlign: 'center',
        fontSize: 30,
        color: '#999'
    },
    otherText: {
        textAlign: 'center',
        color: '#666'
    }
});