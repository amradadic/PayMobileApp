import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import styles from "./styles";
import {
  Button,
  ActivityIndicator,
  Radio,
  List,
  InputItem,
  Icon
} from "@ant-design/react-native";
import QRCode from "react-native-qrcode-svg";
import Modal from "react-native-modal";
import { useAuthContext } from "../../../../../../contexts/AuthContext";
import axios from "axios";
import { BASE_URL } from "../../../../../../app/apiConfig";

const TransferChooser = (props) => {
  const { accountData } = props;

  const { transferModalVisible, setTransferModalVisible } = props;

  const [qrContent, setQrContent] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);
  const { token, logOut } = useAuthContext();
  const [userError, setUserError] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const [stateRadioItemQR, setStateRadioItemQR] = useState(1);
  const RadioItem = Radio.RadioItem;
  const [errorInputAmount, setErrorInputAmount] = useState(null);
  const [inputAmount, setInputAmount] = useState(null);
  const [choosingQRTypeModal, setChoosingQRTypeModal] = useState(false);

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
      console.log(error);
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
      setUserError(error);
    } finally {
      setUserLoading(false);
    }
  };

  const showQR = async (accountData) => {
    const userId = await loadUser();

    if (stateRadioItemQR == 1) {
      const staticContent = { ...accountData, destAccountOwnerId: userId };
      setQrContent(JSON.stringify(staticContent));
    } else {
      const dynamicContent = {
        ...accountData,
        amount: inputAmount,
        destAccountOwnerId: userId,
        dynamic: true
      };
      setQrContent(JSON.stringify(dynamicContent));
    }
    console.log(qrContent);

    setQrVisible(true);
  };

  function showInputItemForInsertingAmount() {
    if (stateRadioItemQR === 2) {
      return (
        <List style={styles.list}>
          <View style={styles.row}>
            <View style={styles.rowMemberInput}>
              <InputItem
                style={styles.listItem}
                error={errorInputAmount}
                value={inputAmount}
                onChange={(value) => {
                  validateInputAmount(value);
                  setInputAmount(value);
                }}
                placeholder="Amount to be transfered"
              />
            </View>
            {showCheckIcon()}
          </View>
        </List>
      );
    }
  }

  function validateInputAmount(inputValue) {
    const regExpr = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;

    if (inputValue != null && regExpr.test(inputValue) == true) {
      setErrorInputAmount(false);
      return true;
    } else {
      setErrorInputAmount(true);
      return false;
    }
  }

  function showCheckIcon() {
    if (errorInputAmount == false) {
      const keyString = "someKey";

      return (
        <View style={styles.rowMemberIcon} key={keyString}>
          <Icon name="check-circle" color="#40EF6D" size="sm" />
        </View>
      );
    }
  }

  return (
    <View style={styles.modal}>
      {!userLoading && (
        <View>
          <List style={styles.choosingQRTypeList}>
            <Text style={styles.moduleTitleText}>
              Please choose whether you want a dynamic or a static QR code
            </Text>
            <View style={styles.radioItemsView}>
              <RadioItem
                style={styles.radioItemStatic}
                checked={stateRadioItemQR === 1}
                onChange={(event) => {
                  if (event.target.checked == true) setStateRadioItemQR(1);
                }}
              >
                Static QR
              </RadioItem>

              <RadioItem
                style={styles.radioItemDynamic}
                checked={stateRadioItemQR === 2}
                onChange={(event) => {
                  if (event.target.checked == true) setStateRadioItemQR(2);
                }}
              >
                Dynamic QR
              </RadioItem>

              {showInputItemForInsertingAmount()}
            </View>
          </List>

          <Button
            style={styles.submitButton}
            type="primary"
            activeStyle={{ backgroundColor: "#061178" }}
            onPress={async () => {
              if (
                !(
                  stateRadioItemQR == 2 &&
                  validateInputAmount(inputAmount) != true
                )
              )
                await showQR(accountData);
            }}
          >
            Submit
          </Button>

          <TouchableOpacity
            style={{
              ...styles.backButton
            }}
            onPress={() => {
              setTransferModalVisible(false);
            }}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
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
          <View style={styles.qrModal}>
            <Text style={styles.qrTitle}>Your QR code</Text>
            <QRCode style={styles.qrCode} size={250} value={qrContent} />
            <TouchableOpacity
              style={{
                ...styles.backButton,
                borderRadius: 6,
                borderColor: "#061178",
                borderWidth: 2,
                width: 250
              }}
              onPress={() => {
                setQrVisible(false);
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
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
