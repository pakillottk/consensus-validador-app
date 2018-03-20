import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import API from '../Communication/API/API';

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
    
    render() {
        return(
            <FlatList
                data={this.state.sessions}
                keyExtractor={ ( session, index ) => session.id }
                renderItem={
                    ( item ) => {
                        const session = item.item;
                        return(
                            <View style={styles.container}>
                                <Text>{session.name}</Text>
                            </View>
                        );
                    }
                }
            />
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
        borderColor: '#eee'
    }
});