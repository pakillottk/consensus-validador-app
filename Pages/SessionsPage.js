import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';

import Datastore from 'react-native-local-mongodb';

const db = new Datastore({
  inMemoryOnly: true
});

for( let i = 0; i < 50; i++ ) {
  db.insert({
    id: i + 1,
    name: 'Sesion ' + i,
    date: new Date()
  });
}

export default class SessionsPage extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            sessions: []
        }

        this.getSessions();
    }

    getSessions() {
        db.find( {}, ( err, docs ) => {
            if( err ) {
                return;
            }

            this.setState({sessions: docs});
        });
    }

    render() {
        return(
            <FlatList
                data={this.state.sessions}
                keyExtractor={ ( session, index ) => session.id }
                renderItem={
                    ( session ) => {
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