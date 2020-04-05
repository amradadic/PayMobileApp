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

  const requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status == "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, [Actions.currentScene]);

  const staticQR = async (data) => {
    const mockResult = {
      transactionId: "302",
      totalPrice: 6.1,
      service: "Cockta (1.0),Coca Cola (2.0)",
    };
    return mockResult;
  };

  const dynamicQR = (data) => {
    return data;
  };

  const fetchData = async (result) => {
    const tempDataStaticFromQR = {
      cashRegisterId: 1,
      officeId: 1,
      businessName: "BINGO",
    };

    const tempDataDynamic = {
      receiptId: "1-1-1-12345678",
      businessName: "BINGO",
      service: "caj, jdjdj",
      totalPrice: 6.1,
    };
    result = tempDataStaticFromQR;
    if (result.cashRegisterId) {
      // this.staticQR(result);
      return await staticQR(result);
    }
    // this.dynamicQR(result);
    return await dynamicQR(result);
  };

  const handleQRCodeRead = async (result) => {
    /**
     * 
       * Vedad TODO:
       * check if static or dynamic
       *  - if static: request for receipt details
       *  result would be:
       *  {
            "transactionId": "302",
            "totalPrice": 6.1,
            "service": "Cockta (1.0),Coca Cola (2.0)"
          }
          Then, after choosing bank account, send request to pay (post):
          {
            "bankAccountId": "352",
            "transactionId": "152"
          }
          ---------------------
            to cancel (post):
            {
              "transactionId": "202"
            }
            cancel result:
            {
              "paymentStatus": "CANCELED",
              "message": "Successfully canceled the payment!"
            }
          --------------------
       *  if dynamic, add bankaccountid and send
          --------------------
          result is:
          {
            "paymentStatus": "PAID",
            "message": "Payment successful!"
          }
          --------------------
       */
    const tempDataStaticFromQR = {
      cashRegisterId: 1,
      officeId: 1,
      businessName: "BINGO",
    };

    const DataStaticAfterRequest = {
      transactionId: "302",
      totalPrice: 6.1,
      service: "Cockta (1.0),Coca Cola (2.0)",
    };

    const StaticRequestForPayment = {
      transactionId: "302",
      bankAccountId: "352",
    };
    //-----------

    const tempDataDynamic = {
      receiptId: "1-1-1-12345678",
      businessName: "BINGO",
      service: "caj, jdjdj",
      totalPrice: 6.1,
    };

    const dynamicRequestForPayment = {
      receiptId: "1-1-1-12345678",
      businessName: "BINGO",
      service: "caj, jdjdj",
      totalPrice: 6.1,
      bankAccountId: "352",
    };

    if (!checkoutModalVisible && !accountChooserModalVisible) {
      setLastScannedData(null);
    }
    if (lastScannedData == null) {
      LayoutAnimation.spring();

      const resolvedData = await fetchData(tempDataStaticFromQR);
      setLastScannedData(resolvedData);
      setAccountChooserModalVisible(true);
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
        <Text>Initializing QR scanner</Text>
      ) : hasCameraPermission == false ? (
        <Text style={{ color: "#fff" }}>Camera permission is not granted</Text>
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
        maskClosable={false}
        isVisible={accountChooserModalVisible}
        onBackButtonPress={() => {
          setAccountChooserModalVisible(false);
        }}
        onBackdropPress={() => {
          setAccountChooserModalVisible(false);
        }}
      >
        <AccountChooser
          setVisible={setAccountChooserModalVisible}
          data={lastScannedData}
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
        maskClosable={false}
        transparent
        isVisible={checkoutModalVisible}
        onBackButtonPress={() => {
          setCheckoutModalVisible(false);
          setTimeout(() => {
            setAccountChooserModalVisible(true);
          }, 500);
        }}
        onBackdropPress={() => {
          setCheckoutModalVisible(false);
          setTimeout(() => {
            setAccountChooserModalVisible(true);
          }, 500);
        }}
      >
        <CheckoutInfo
          transactionData={lastScannedData}
          accountData={accountData}
          onBackPressed={() => {
            setCheckoutModalVisible(false);
            setTimeout(() => {
              setAccountChooserModalVisible(true);
            }, 500);
          }}
        />
      </Modal>
    </ScrollView>
  );
};
export default QRScanner;
