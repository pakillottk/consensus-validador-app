import React from 'react';

import { View, Text, StyleSheet, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class LoginPage extends React.Component {
    goToSessions() {
        return Actions.sessions;
    }

    render() {
        return(
            <View>
                <Text>My login page</Text>
                <Button 
                    title="Ir a sesiones" 
                    accesibilityLabel="Va a las sesiones"
                    onPress={Actions.sessions}
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