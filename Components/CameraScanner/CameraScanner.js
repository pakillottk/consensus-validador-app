import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

export default class CameraScanner extends React.Component {
  state = {
    hasCameraPermission: null,
  }

   async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Cargando...</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>Acceso a la cámara denegado.</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Button color="red" title="CANCELAR" onPress={() => this.props.onBarCodeRead( null )}/>
          <BarCodeScanner
            onBarCodeRead={this.props.onBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
        </View>
      );
    }
  }

  _handleBarCodeRead = ({ type, data }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  }
}