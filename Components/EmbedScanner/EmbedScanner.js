import React from 'react'

import { TextInput, Keyboard } from 'react-native'

export default class EmbedScanner extends React.Component {
    constructor( props ) {
        super( props )

        this.state = {
            lecture: ''
        }
    }

    updateLecture( value ) {
        this.setState({ lecture: value })
    }

    endLecture() {
        const { onLecture } = this.props
        console.log( 'scanned ' + this.state.lecture );
        onLecture( this.state.lecture );
        this.setState({ lecture: '' });
    }

    render() {
        return(
            <TextInput 
                autoFocus={true}
                blurOnSubmit={false}
                onChangeText={ ( value ) => this.updateLecture( value ) } 
                value={this.state.lecture}
                onSubmitEditing={() => this.endLecture()}
            />
        );
    }
}