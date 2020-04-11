import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import styles from "./styles";
import {
  Button,
  ActivityIndicator,
  Radio,
  List,
  InputItem,
  Icon,
  Toast
} from "@ant-design/react-native";
import QRCode from "react-native-qrcode-svg";
import Modal from "react-native-modal";
import { useAuthContext } from "../../../../../../contexts/AuthContext";

const TransferChooser = ({ accountData }) => {
  const [qrContent, setQrContent] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);
  const { token, logOut } = useAuthContext();
  const [userError, setUserError] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const [stateRadioItemQR, setStateRadioItemQR] = useState(1);
  const RadioItem = Radio.RadioItem;
  const [errorInputAmount, setErrorInputAmount] = useState(null);
  const [inputAmount, setInputAmount] = useState(null);

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

  const showQR = async (accountData) => {
    const userId = await loadUser();

    if (stateRadioItemQR == 1) {
      const staticContent = accountData;

      setQrContent(JSON.stringify(staticContent));

      //console.log(JSON.stringify(staticContent));
    }
    else {
      const dynamicContent = {
        ...accountData,
        amount: inputAmount,
        destAccountOwnerId: userId,
        dynamic: true
      };

      setQrContent(JSON.stringify(dynamicContent));

      //console.log(JSON.stringify(dynamicContent));
    }

    setQrVisible(true);
  };

  function showInputItemForInsertingAmount() {
    if (stateRadioItemQR === 2) {
      return <List style={styles.list}>
        <View style={styles.row}>
          <View style={styles.rowMemberInput}>
            <InputItem
              style={styles.listItem}
              error={errorInputAmount}
              value={inputAmount}

              onChange={value => {
                validateInputAmount(value);
                setInputAmount(value);
              }}

              onErrorClick={() =>
                Toast.fail("The input amount is not in correct format", 0.05 * value.length)
              }

              placeholder="Amount to be transfered"
            />
          </View>
          {
            showCheckIcon()
          }
        </View>
      </List>
    }
  }

  function validateInputAmount(inputValue) {
    const regExpr = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;

    //console.log("unesena vrijednost: " + inputValue);
    //console.log("rezultat provjere regexa je: " + regExpr.test(inputValue));
    if (inputValue != null && regExpr.test(inputValue) == true) {
      //console.log("tacan format unosa");
      setErrorInputAmount(false);
      return true;
    }
    else {
      //console.log("netacan format unosa");
      setErrorInputAmount(true);
      return false;
    }
  }

  function showCheckIcon() {
    if (errorInputAmount == false) {
      const keyString = "someKey";

      return <View style={styles.rowMemberIcon} key={keyString}>
        < Icon
          name="check-circle"
          color="#40EF6D"
          size="sm"
          onPress={() =>
            Toast.success("The input amount is in correct format")
          }
        />
      </View>
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

                onChange={event => {
                  if (event.target.checked == true)
                    setStateRadioItemQR(1);
                }}
              >
                Static QR
              </RadioItem>

              <RadioItem
                style={styles.radioItemDynamic}
                checked={stateRadioItemQR === 2}

                onChange={event => {
                  if (event.target.checked == true)
                    setStateRadioItemQR(2);
                }}
              >
                Dynamic QR
              </RadioItem>

              {
                showInputItemForInsertingAmount()
              }
            </View>
          </List>

          <Button
            onPress={() => {
              if (stateRadioItemQR == 2 && validateInputAmount(inputAmount) != true)
                Toast.fail("The input amount is not in correct format", 3);
              else
                showQR(accountData);
            }}
          >
            Submit
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
