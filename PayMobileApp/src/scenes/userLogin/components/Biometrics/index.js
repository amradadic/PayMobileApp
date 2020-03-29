import React, { Component } from "react";
import { View, Text, Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { getSupportedBioTypes, isBiometricsSupported } from "./utils";
import {
  FINGERPRINT,
  FACEID,
  MAX_ATTEMPTS,
  MAX_ATTEMPTS_REACHED_MSG,
  DEFAULT_LOCKOUT_ERR,
  FINGERPRINT_PROMPT,
  FACEID_PROMPT,
  DEFAULT_CANCEL_ERR
} from "./constants";
import { Button } from "@ant-design/react-native";
import styles from "./styles";
import AuthFailed from "./components/AuthFailed";
import Modal from "react-native-modal";

export default class Biometrics extends Component {
  state = {
    btnTitle: "Use ",
    sensorPrompt: "",
    error: "",
    authenticated: false,
    modalVisible: false,
    attemptsRemaining: MAX_ATTEMPTS,
    enableBiometrics: true
  };

  setModalVisible = visible => {
    console.log("State: ", this.state);
    console.log("vis:", visible);
    if (!visible) LocalAuthentication.cancelAuthenticate();
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
        console.log(results);
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
    let newAttemptsRemaining = attemptsRemaining - 1;

    if (newAttemptsRemaining == 0) {
      outputError = MAX_ATTEMPTS_REACHED_MSG;
    } else if (error && message) {
      outputError = message;
      console.log(error, message, error == DEFAULT_CANCEL_ERR);
      if (error == DEFAULT_LOCKOUT_ERR) outputError = MAX_ATTEMPTS_REACHED_MSG;
      else if (error == DEFAULT_CANCEL_ERR) {
        newAttemptsRemaining++;
        outputError = "";
      }
    }
    console.log("OUT", outputError);

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
    let { btnTitle, sensorPrompt } = this.state;
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
      <View>
        {enableBiometrics && !authenticated && (
          <Button
            disabled={attemptsRemaining == 0}
            activeStyle={styles.biometricsButtonActive}
            style={styles.biometricsButton}
            title={btnTitle}
            onPress={() => {
              if (error == "" || attemptsRemaining != 0) {
                if (Platform.OS === "android") {
                  this.setModalVisible(!modalVisible);
                } else {
                  this.scanFingerPrint();
                }
              }
            }}
          >
            <Text style={styles.biometricsButtonText}>{btnTitle}</Text>
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
          isVisible={modalVisible}
          onShow={this.scanFingerPrint}
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
                {error == "" ? sensorPrompt : error}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
