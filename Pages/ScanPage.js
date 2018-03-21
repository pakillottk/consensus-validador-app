import React from 'react'
import { View, Text } from 'react-native'

import CodeCollection from '../Database/Models/CodeCollection'

export default class ScanPage extends React.Component {
    constructor( props ) {
        super( props )

        this.state = {
            collection: null,
            validated: 0,
            toValidate: 0
        }
    } 

    async componentWillMount() {
        const collection = new CodeCollection( this.props.session );
        const toValidate = await collection.countCodes();
        this.setState({ collection, toValidate, validated: collection.validated });
    }

    render() {
        const { session } = this.props
        return(
            <View>
                <Text>{session.name}</Text>
                <Text>ESCANEADOS: {this.state.validated}/{this.state.toValidate}</Text>
            </View>
        )
    }
}