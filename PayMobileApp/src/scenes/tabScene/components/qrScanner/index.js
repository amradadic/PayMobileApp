import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import React, { Component } from "react";
import { Dimensions, LayoutAnimation, Text, View } from "react-native";
import Modal from "react-native-modal";
import styles from "./styles";

export default class QRScanner extends Component {
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    modalVisible: false
  };

  componentDidMount() {
    this.requestCameraPermission();
  }

  requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status == "granted"
    });
  };

  handleQRCodeRead = result => {
    if (result.data != this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
      this.setModalVisible(true);
    }
  };

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission == null ? (
          <Text>Initializing QR scanner</Text>
        ) : this.state.hasCameraPermission == false ? (
          <Text style={{ color: "#fff" }}>
            Camera permission is not granted
          </Text>
        ) : (
          <BarCodeScanner
            onBarCodeScanned={this.handleQRCodeRead}
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width
            }}
          />
        )}

        <Modal
          animationType="slide"
          transparent={false}
          isVisible={this.state.modalVisible}
          onBackButtonPress={() => {
            this.setModalVisible(false);
          }}
          onBackdropPress={() => {
            this.setModalVisible(false);
          }}
        >
          <View style={styles.modal}>
            <View style={styles.innerContainer}>
              <Text style={styles.modalText}>
                QR Result: {this.state.lastScannedUrl}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
