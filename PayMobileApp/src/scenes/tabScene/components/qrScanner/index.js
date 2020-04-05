import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import React, { Component } from "react";
import { Dimensions, LayoutAnimation, Text, View } from "react-native";
import Modal from "react-native-modal";
import styles from "./styles";
import CheckoutInfo from "./components/checkoutInfo";
import AccountChooser from "./components/accountChooser";

export default class QRScanner extends Component {
  state = {
    hasCameraPermission: null,
    lastScannedData: null,
    accountChooserModalVisible: false,
    checkoutModalVisible: false,
    accountData: null,
  };

  componentDidMount() {
    this.requestCameraPermission();
  }

  requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status == "granted",
    });
  };

  handleQRCodeRead = (result) => {
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
    const dynamicRequestForPayment = {
      receiptId: "1-1-1-12345678",
      businessName: "BINGO",
      service: "caj, jdjdj",
      totalPrice: "6.1",
      bankAccountId: "352",
    };

    const tempDataDynamic = {
      receiptId: "1-1-1-12345678",
      businessName: "BINGO",
      service: "caj, jdjdj",
      totalPrice: "6.1",
    };
    if (
      !this.state.checkoutModalVisible &&
      !this.state.accountChooserModalVisible
    ) {
      this.setState({ lastScannedData: null });
    }
    if (this.state.lastScannedData == null) {
      LayoutAnimation.spring();
      this.setState({ lastScannedData: tempDataDynamic });
      this.setAccountChooserModalVisible(true);
    }
  };

  setAccountChooserModalVisible = (visible) => {
    this.setState({ accountChooserModalVisible: visible });
  };

  setCheckoutModalVisible = (visible) => {
    this.setState({ checkoutModalVisible: visible });
  };

  setChosenAccountData = (accountData) => {
    this.setState({ accountData });
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
              width: Dimensions.get("window").width,
            }}
          />
        )}

        <Modal
          transparent
          maskClosable={false}
          isVisible={this.state.accountChooserModalVisible}
          onBackButtonPress={() => {
            this.setAccountChooserModalVisible(false);
          }}
          onBackdropPress={() => {
            this.setAccountChooserModalVisible(false);
          }}
        >
          <AccountChooser
            setVisible={this.setAccountChooserModalVisible}
            data={this.state.lastScannedData}
            onNextPressed={(accountData) => {
              this.setChosenAccountData(accountData);
              this.setAccountChooserModalVisible(false);
              this.setCheckoutModalVisible(true);
            }}
          />
        </Modal>

        <Modal
          maskClosable={false}
          transparent
          isVisible={this.state.checkoutModalVisible}
          onBackButtonPress={() => {
            this.setAccountChooserModalVisible(true);
            this.setCheckoutModalVisible(false);
          }}
          onBackdropPress={() => {
            this.setAccountChooserModalVisible(true);
            this.setCheckoutModalVisible(false);
          }}
        >
          <CheckoutInfo
            transactionData={this.state.lastScannedData}
            accountData={this.state.accountData}
            onBackPressed={() => {
              this.setAccountChooserModalVisible(true);
              this.setCheckoutModalVisible(false);
            }}
          />
        </Modal>
      </View>
    );
  }
}
