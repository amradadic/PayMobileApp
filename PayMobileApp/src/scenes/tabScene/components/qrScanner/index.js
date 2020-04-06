import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import React, { Component, createContext, useEffect, useState } from "react";
import {
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import Modal from "react-native-modal";
import styles from "./styles";
import CheckoutInfo from "./components/checkoutInfo";
import AccountChooser from "./components/accountChooser";
import axios from "axios";
import { BASE_URL } from "../../../../app/apiConfig";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";
import { Toast, ActivityIndicator } from "@ant-design/react-native";

export const Context = createContext();

const QRScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [lastScannedData, setLastScannedData] = useState(null);
  const [accountChooserModalVisible, setAccountChooserModalVisible] = useState(
    false
  );
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const { token, logOut } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [initiatedPayment, setInitiatedPayment] = useState(false);
  const [sleepDone, setSleepDone] = useState(true);
  const [error, setError] = useState(false);
  const [qrType, setQrType] = useState(null);

  const requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const granted = status == "granted";
    if (!granted) Toast.fail("Camera permission is not granted");
    setHasCameraPermission(granted);
  };

  useEffect(() => {
    requestCameraPermission();
  }, [Actions.currentScene]);

  const staticQR = async (inputData) => {
    console.log(inputData);

    const parsedData = JSON.parse(inputData);
    console.log(parsedData);
    try {
      const { data } = await axios.post(
        `${BASE_URL}api/payments/receipt/info`,
        { ...parsedData },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`,
          },
        }
      );
      console.log("RESULT", data);
      setQrType("static");
      return data;
    } catch (error) {
      console.log(error);
      if (error.message.includes("401")) {
        setError(error);
        Toast.fail("You are unauthorized. Please log in", 1);
      } else {
        setError(error);
        Toast.fail("Error has occured. Please try again", 1);
      }
      setQrType(null);
      return null;
    }
  };

  const dynamicQR = (data) => {
    setQrType("dynamic");
    return JSON.parse(data);
  };

  const fetchData = async (result) => {
    console.log("result", result);
    if (result.search("receiptId") != -1) {
      return dynamicQR(result);
    }
    return await staticQR(result);
  };

  const handleQRCodeRead = async (result) => {
    if (!initiatedPayment && sleepDone) {
      LayoutAnimation.spring();
      console.log(result.data);
      setInitiatedPayment(true);
      const resolvedData = await fetchData(result.data);
      console.log("resolved", resolvedData);
      if (resolvedData) {
        setLastScannedData(resolvedData);
        setSleepDone(false);
        setAccountChooserModalVisible(true);
      } else setInitiatedPayment(false);
    }
  };

  const setChosenAccountData = (accountData) => {
    setAccountData(accountData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await requestCameraPermission();
    setRefreshing(false);
  };

  const hideAccountChooserModal = () => {
    setAccountChooserModalVisible(false);
    setInitiatedPayment(false);
    setTimeout(() => {
      setSleepDone(true);
    }, 3000);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Scan your QR code</Text>
      </View>
      {hasCameraPermission == null ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            paddingTop: 40,
          }}
        >
          <ActivityIndicator size="large" color="#061178" />
        </View>
      ) : hasCameraPermission == false ? (
        <Text style={styles.info}></Text>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={handleQRCodeRead}
          style={{
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
          }}
        />
      )}

      <Modal
        transparent
        isVisible={accountChooserModalVisible}
        onBackButtonPress={() => {
          hideAccountChooserModal();
        }}
      >
        <AccountChooser
          setVisible={() => {
            hideAccountChooserModal();
          }}
          data={lastScannedData}
          onNextPressed={(accountData) => {
            setChosenAccountData(accountData);
            setAccountChooserModalVisible(false);
            
            setTimeout(() => {
              setCheckoutModalVisible(true);
            },500);
          }}
        />
      </Modal>

      <Modal
        transparent
        isVisible={checkoutModalVisible}
        onBackButtonPress={() => {
          setCheckoutModalVisible(false);
          setTimeout(() => {
            hideAccountChooserModal();
          }, 500);
        }}
      >
        <CheckoutInfo
          qrType = {qrType}
          setVisible={setCheckoutModalVisible}
          transactionData={lastScannedData}
          accountData={accountData}
          onBackPressed={() => {
            setCheckoutModalVisible(false);
            setTimeout(() => {
              hideAccountChooserModal();
            }, 500);
          }}
        />
      </Modal>
    </ScrollView>
  );
};
export default QRScanner;
