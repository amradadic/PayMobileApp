import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import styles from "./styles";
import { Button } from "@ant-design/react-native";
import QRCode from "react-native-qrcode-svg";
import Modal from "react-native-modal";

const TransferChooser = ({ accountData }) => {
  const [qrContent, setQrContent] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);

  const showQR = (content) => {
    const dynamicContent = {
      ...content,
      amount: 20,
      dynamic: true
    };

    const staticContent = content;

    const stringContent = JSON.stringify(dynamicContent);
    setQrContent(stringContent);
    console.log(stringContent);

    setQrVisible(true);
  };

  return (
    <View style={styles.modal}>
      <Text>Test</Text>
      <Button
        onPress={() => {
          showQR(accountData);
        }}
      >
        Next
      </Button>

      {qrContent && (
        <Modal
          isVisible={qrVisible}
          onBackButtonPress={() => {
            setQrVisible(false);
          }}
          onBackdropPress={() => {
            setQrVisible(false);
          }}
        >
          <View style={styles.qrModaL}>
            <QRCode style={styles.qrCode} value={qrContent} />
          </View>
        </Modal>
      )}
    </View>
  );
};
export default TransferChooser;
