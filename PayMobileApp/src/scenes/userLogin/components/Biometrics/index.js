import React, { Component } from "react";
import { View, Text, Modal, StyleSheet, Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { getSupportedBioTypes, isBiometricsSupported } from "./utils";
import {
  FINGERPRINT,
  FACEID,
  MAX_ATTEMPTS,
  MAX_ATTEMPTS_REACHED_MSG,
  DEFAULT_LOCKOUT_ERR,
  FINGERPRINT_PROMPT,
  FACEID_PROMPT
} from "./constants";
import { Button } from "@ant-design/react-native";
import Constants from "expo-constants";
import AuthFailed from "./components/AuthFailed";

export default class Biometrics extends Component {
  state = {
    btnTitle: "Sign in with ",
    sensorPrompt: "",
    error: "",
    authenticated: false,
    modalVisible: false,
    attemptsRemaining: MAX_ATTEMPTS,
    enableBiometrics: true
  };

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  clearState = () => {
    this.setState({ authenticated: false, failedCount: 0 });
  };

  scanFingerPrint = async () => {
    try {
      let results = await LocalAuthentication.authenticateAsync();
      if (results.success) {
        this.onAuthSuccess();
      } else {
        this.onAuthFail(results);
      }
    } catch (e) {
      console.log(e);
    }
  };

  onAuthFail = results => {
    console.log(results);
    let outputError = "";
    const { error, message } = results;
    const { attemptsRemaining } = this.state;
    const newAttemptsRemaining = attemptsRemaining - 1;

    if (newAttemptsRemaining == 0) {
      outputError = MAX_ATTEMPTS_REACHED_MSG;
    } else if (error && message) {
      outputError = message;
      if (error == DEFAULT_LOCKOUT_ERR) outputError = MAX_ATTEMPTS_REACHED_MSG;
    }

    this.setState({
      attemptsRemaining: newAttemptsRemaining,
      modalVisible: false,
      error: outputError
    });
  };

  onAuthSuccess = () => {
    // TODO: call prop from login component
    this.setState({
      modalVisible: false,
      authenticated: true,
      attemptsRemaining: 0
    });
  };

  updateBtnTitle = ({ fingerprint, faceId }) => {
    let btnTitle = "Login using ";
    let sensorPrompt = "";
    if (fingerprint && faceId) {
      sensorPrompt = `${FINGERPRINT_PROMPT} or ${FACEID_PROMPT}`;
      btnTitle += `${FINGERPRINT} or ${FACEID}`;
    } else {
      if (fingerprint) {
        sensorPrompt = `${FINGERPRINT_PROMPT}`;
        btnTitle += `${FINGERPRINT}`;
      } else if (faceId) {
        sensorPrompt = `${FACEID_PROMPT}`;
        btnTitle += `${FACEID}`;
      }
    }
    this.setState({ btnTitle, sensorPrompt });
    return true;
  };

  supportedAuthenticationTypes = async () => {
    const supportedTypes = await getSupportedBioTypes();
    return supportedTypes ? this.updateBtnTitle(supportedTypes) : false;
  };

  verifyBiometrics = async () => {
    try {
      const isSupported = await isBiometricsSupported();
      return isSupported ? await this.supportedAuthenticationTypes() : false;
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount = async () => {
    if (!(await this.verifyBiometrics()))
      this.setState({ enableBiometrics: false });
  };

  render() {
    const {
      modalVisible,
      enableBiometrics,
      btnTitle,
      sensorPrompt,
      attemptsRemaining,
      authenticated,
      error
    } = this.state;
    return (
      <View
        style={[
          styles.container,
          modalVisible
            ? { backgroundColor: "#b7b7b7" }
            : { backgroundColor: "white" }
        ]}
      >
        {enableBiometrics && !authenticated && (
          <Button
            title={btnTitle}
            onPress={() => {
              if (error == "") {
                if (Platform.OS === "android") {
                  this.setModalVisible(!modalVisible);
                } else {
                  this.scanFingerPrint();
                }
              }
            }}
          >
            {btnTitle}
          </Button>
        )}

        {authenticated && (
          <Text style={styles.text}>Authentication Successful! 🎉</Text>
        )}
        {attemptsRemaining < MAX_ATTEMPTS && (
          <AuthFailed error={error} authenticated={authenticated} />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onShow={this.scanFingerPrint}
        >
          <View style={styles.modal}>
            <View style={styles.innerContainer}>
              <Text>{error == "" ? sensorPrompt : error}</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    paddingTop: Constants.statusBarHeight,
    padding: 8
  },
  modal: {
    flex: 1,
    marginTop: "90%",
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center"
  },
  innerContainer: {
    marginTop: "30%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    alignSelf: "center",
    fontSize: 22,
    paddingTop: 20
  }
});
