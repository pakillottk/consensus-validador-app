import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';

import LocalMongoDB from '../Database/LocalMongoDB';

export default class SessionsPage extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            sessions: []
        }

        this.DB = new LocalMongoDB( undefined, true, false );
        for( let i = 0; i < 50; i++ ) {
            this.DB.insert({
                id: i,
                name: 'Sesion ' + (i+1)
            }).then( ( session ) => this.addSession( session ) );
        }
    }

    addSession( session ) {
        this.setState({ sessions: [...this.state.sessions, session ] })
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