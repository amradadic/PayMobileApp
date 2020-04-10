import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import styles from "./styles";
import { Button, ActivityIndicator } from "@ant-design/react-native";
import QRCode from "react-native-qrcode-svg";
import Modal from "react-native-modal";
import { useAuthContext } from "../../../../../../contexts/AuthContext";

const TransferChooser = ({ accountData }) => {
  const [qrContent, setQrContent] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);
  const { token, logOut } = useAuthContext();
  const [userError, setUserError] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const loadUser = async () => {
    try {
      setUserError(null);
      setUserLoading(true);
      const { data } = await axios.get(`${BASE_URL}api/auth/user/me`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      });
      const { id } = data;
      return id;
    } catch (error) {
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
      setUserError(error);
    } finally {
      setUserLoading(false);
    }
  };

  const showQR = async (content) => {
    const userId = await loadUser();
    const dynamicContent = {
      ...content,
      amount: 20,
      destAccountOwnerId: userId,
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
      {!userLoading && (
        <View>
          <Text>Test</Text>
          <Button
            onPress={() => {
              showQR(accountData);
            }}
          >
            Next
          </Button>
        </View>
      )}
      {qrContent && !userLoading && (
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
      {userLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            paddingTop: 30
          }}
        >
          <ActivityIndicator size="large" color="#061178" />
        </View>
      )}
    </View>
  );
};
export default TransferChooser;
