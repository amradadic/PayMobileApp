import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import React, { Component, createContext, useEffect, useState } from "react";
import {
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  ScrollView,
  RefreshControl
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
    try {
      const parsedData = JSON.parse(inputData);

      const { data } = await axios.post(
        `${BASE_URL}api/payments/receipt/info`,
        { ...parsedData },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }
      );
      setQrType("static");
      return data;
    } catch (error) {
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
    try {
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      Toast.fail("Error has occured. Please try again", 1);
    }
  };

  const dynamicQRTransfer = async (data) => {
    // choose account, then
    // transfer funds to account if available
    try {
      const parsedData = JSON.parse(data);
      console.log(`Transferring ${parsedData.amount} to: `, parsedData);
    } catch (err) {
      Toast.fail("Error has occured. Please try again", 1);
    }
  };

  const staticQRTransfer = async (data) => {
    // choose account + amount of money, then
    // transfer funds to account if available
    try {
      const parsedData = JSON.parse(data);
      console.log("Transferring (with money) to: ", parsedData);
    } catch (err) {
      Toast.fail("Error has occured. Please try again", 1);
    }
  };

  const fetchData = async (result) => {
    if (result.search("cardNumber") != -1) {
      console.log(result);
      return result.search("dynamic") != -1
        ? await dynamicQRTransfer(result)
        : await staticQRTransfer(result);
    }

    if (result.search("receiptId") != -1) {
      return dynamicQR(result);
    }
    return await staticQR(result);
  };

  const handleQRCodeRead = async (result) => {
    if (!initiatedPayment && sleepDone) {
      LayoutAnimation.spring();
      setInitiatedPayment(true);

      const resolvedData = await fetchData(result.data);
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
    <View
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
            paddingTop: 100
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
            zIndex: -1,
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
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
          qrType={qrType}
          setVisible={() => {
            hideAccountChooserModal();
          }}
          data={lastScannedData}
          transactionData={lastScannedData}
          onNextPressed={(accountData) => {
            setChosenAccountData(accountData);
            setAccountChooserModalVisible(false);

            setTimeout(() => {
              setCheckoutModalVisible(true);
            }, 500);
          }}
        />
      </Modal>

      <Modal
        transparent
        isVisible={checkoutModalVisible}
        onBackButtonPress={() => {
          setCheckoutModalVisible(false);
          setTimeout(() => {
            setAccountChooserModalVisible(true);
          }, 500);
        }}
      >
        <CheckoutInfo
          qrType={qrType}
          setVisible={setCheckoutModalVisible}
          transactionData={lastScannedData}
          accountData={accountData}
          onPaymentFinished={() => {
            setCheckoutModalVisible(false);
            setTimeout(() => {
              hideAccountChooserModal();
            }, 500);
          }}
          onBackPressed={() => {
            setCheckoutModalVisible(false);
            setTimeout(() => {
              setAccountChooserModalVisible(true);
            }, 500);
          }}
        />
      </Modal>
    </View>
  );
};
export default QRScanner;
