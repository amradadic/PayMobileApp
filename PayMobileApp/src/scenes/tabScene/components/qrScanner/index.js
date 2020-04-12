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
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import styles from "./styles";
import CheckoutInfo from "./components/checkoutInfo";
import AccountChooser from "./components/accountChooser";
import axios from "axios";
import { BASE_URL } from "../../../../app/apiConfig";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";
import {
  Toast,
  ActivityIndicator,
  List,
  Icon,
  InputItem,
  Button
} from "@ant-design/react-native";

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

  const [insertAmountModalVisible, setInsertAmountModalVisible] = useState(
    false
  );
  const [errorInputAmount, setErrorInputAmount] = useState(null);
  const [inputAmount, setInputAmount] = useState(null);
  const [sourceAccountForTransfer, setSourceAccountForTransfer] = useState(
    null
  );
  const [
    securityQuestionModalVisible,
    setSecurityQuestionModalVisible
  ] = useState(false);
  const [inputAnswer, setInputAnswer] = useState(null);
  const [securityQuestion, setSecurityQuestion] = useState(null);

  const requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const granted = status == "granted";
    if (!granted) Toast.fail("Camera permission is not granted");
    setHasCameraPermission(granted);
  };

  const getSecurityQuestion = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/auth/user/me`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      });
      const { data } = await axios.post(
        `${BASE_URL}api/recover/securityquestion`,
        { usernameOrEmail: response.data.username },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }
      );
      setSecurityQuestion(data.title);
    } catch (error) {
      Toast.fail("Error has occured. Please try again", 0.7);
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
    }
  };

  useEffect(() => {
    requestCameraPermission();
    getSecurityQuestion();
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

  const initTransfer = async (paymentInfo) => {
    console.log("DESTINATION", lastScannedData);
    console.log("SOURCE", accountData);
    console.log("AMOUNT", inputAmount);

    const { answer } = paymentInfo;
    const { destAccountOwnerId, id } = lastScannedData;

    const requestObj = {
      amount: inputAmount,
      answer,
      destAccountOwnerId,
      destinationBankAccount: id,
      sourceBankAccount: accountData.id
    };

    console.log("REQUEST OBJ", requestObj);
    console.log("-------");

    try {
      const { data } = await axios.post(
        `${BASE_URL}api/accounts/moneyTransfer/outerTransfer`,
        requestObj,
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }
      );

      console.log("RESPONSE DATA", data);

      if (!data.moneyTransferStatus || data.moneyTransferStatus != "OK") {
        Toast.fail(`Failed to transfer the money: ${data.message}`, 3);
      } else {
        Toast.success("Transfer completed successfuly!", 3);
        hideSecurityQuestionModal();
        setSourceAccountForTransfer(null);
      }
    } catch (err) {
      console.log("ERR", err);
      Toast.fail("Error has occured. Please try again", 3);
    }
  };

  const fetchData = async (result) => {
    if (result.search("cardNumber") != -1) {
      try {
        const parsedData = JSON.parse(result);
        if (parsedData.dynamic) setInputAmount(parsedData.amount);
        return parsedData;
      } catch (err) {
        Toast.fail("Error has occured. Please try again", 1);
      }
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
    resetQR();
  };

  const hideSecurityQuestionModal = () => {
    setSecurityQuestionModalVisible(false);
    resetQR();
  };

  const hideInsertAmountModal = () => {
    setInsertAmountModalVisible(false);
    resetQR();
  };

  const hideCheckoutModal = () => {
    setCheckoutModalVisible(false);
    resetQR();
  };

  const resetQR = () => {
    setInitiatedPayment(false);
    setTimeout(() => {
      setSleepDone(true);
    }, 3000);
  };

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
          <Icon
            name="check-circle"
            color="#40EF6D"
            size="sm"
            onPress={() =>
              Toast.success("The input amount is in correct format")
            }
          />
        </View>
      );
    }
  }

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
              if (!lastScannedData.cardNumber) {
                setCheckoutModalVisible(true);
              } else {
                if (lastScannedData.dynamic) {
                  setSecurityQuestionModalVisible(true);
                  setSourceAccountForTransfer(lastScannedData);
                } else {
                  setInsertAmountModalVisible(true);
                  setSourceAccountForTransfer(lastScannedData);
                }
              }
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

      <Modal
        transparent
        isVisible={insertAmountModalVisible}
        onBackButtonPress={() => {
          setInsertAmountModalVisible(false);
          setTimeout(() => {
            setAccountChooserModalVisible(true);
          }, 500);
        }}
      >
        <View style={styles.modalInsertAmount}>
          <Text style={styles.moduleTitleText}>
            Please insert the amount you want to transfer
            </Text>
          <View style={styles.row}>
            <View style={styles.rowMemberInput}>
              <InputItem
                style={{ ...styles.listItem, backgroundColor: "white" }}
                error={errorInputAmount}
                value={inputAmount}
                onChange={(value) => {
                  validateInputAmount(value);
                  setInputAmount(value);
                }}
                onErrorClick={() =>
                  Toast.fail(
                    "The input amount is not in correct format",
                    0.05 * value.length
                  )
                }
                placeholder="Amount to be transfered"
              />
            </View>
            {showCheckIcon()}
          </View>
          <Button
            style={styles.submitButton}
            type="primary"
            activeStyle={{ backgroundColor: "#061178" }}
            onPress={() => {
              if (validateInputAmount(inputAmount) != true)
                Toast.fail(
                  "The input amount is not in correct format",
                  0.05 * inputAmount.length
                );
              else {
                setSecurityQuestionModalVisible(true);
              }
            }}
          >
            Next
            </Button>

          <TouchableOpacity
            style={{
              ...styles.backButton
            }}
            onPress={() => {
              setInsertAmountModalVisible(false);
              setSecurityQuestionModalVisible(false);
              setAccountChooserModalVisible(false);
              setSourceAccountForTransfer(null);
            }}
          >
            <Text
              style={styles.backButtonText}
            >
              Cancel
              </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        transparent
        isVisible={securityQuestionModalVisible}
        onBackButtonPress={() => {
          setSecurityQuestionModalVisible(false);
          if (lastScannedData.dynamic) {
            setTimeout(() => {
              setAccountChooserModalVisible(true);
            }, 500);
          } else {
            setTimeout(() => {
              setInsertAmountModalVisible(true);
            }, 500);
          }
        }}
      >
        <View style={styles.modalInsertAmount}>
          <Text style={styles.moduleTitleText}>Sequrity question</Text>
          <Text style={styles.sequrityQuestion}>{securityQuestion}</Text>

          <View style={styles.row}>
            <View style={styles.rowMemberInput}>
              <InputItem
                style={styles.listItem}
                value={inputAnswer}
                onChange={(value) => {
                  setInputAnswer(value);
                }}
                placeholder="Answer to security question"
              />
            </View>
          </View>

          <Button
            style={styles.submitButton}
            type="primary"

            onPress={async () => {
              await initTransfer({
                ...sourceAccountForTransfer,
                amount: inputAmount,
                answer: inputAnswer
              });
            }}
          >
            Submit
            </Button>

          <TouchableOpacity
            style={{
              ...styles.backButton
            }}
            onPress={() => {
              setInsertAmountModalVisible(false);
              setSecurityQuestionModalVisible(false);
              setAccountChooserModalVisible(false);
              setSourceAccountForTransfer(null);
            }}
          >
            <Text
              style={styles.backButtonText}
            >
              Cancel
              </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default QRScanner;
