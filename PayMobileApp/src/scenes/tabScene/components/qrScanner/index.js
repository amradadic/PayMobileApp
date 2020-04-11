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
  Button
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
  InputItem
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

  const [transferQRData, setTransferQRData] = useState(null);

  const [insertAmountModalVisible, setInsertAmountModalVisible] = useState(false);
  const [errorInputAmount, setErrorInputAmount] = useState(null);
  const [inputAmount, setInputAmount] = useState(null);
  const [sourceAccountForTransfer, setSourceAccountForTransfer] = useState(null);
  const [securityQuestionModalVisible, setSecurityQuestionModalVisible] = useState(false);
  const [inputAnswer, setInputAnswer] = useState(null);

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
    }
    catch (error) {
      if (error.message.includes("401")) {
        setError(error);
        Toast.fail("You are unauthorized. Please log in", 1);
      }
      else {
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

  const staticQRTransfer = async (sourceAccount) => {
    console.log("STATIC");

    setInsertAmountModalVisible(true);
    setSourceAccountForTransfer(sourceAccount);
  };

  const initTransfer = async (sourceAccount) => {
    console.log("DYNAMIC OR CAME FROM STATIC");
    console.log("INFO RECEIVED: ", sourceAccount);

    try {
      //OVO OTKOMENTARISATI, OVDJE FALI SAMO "answer" DA BI SE POSALO POST REQUEST
      /*const { data } = await axios.post(
        `${BASE_URL}/api/accounts/moneyTransfer/outerTransfer/${selectedQuestion}`,
        {
          //OVDJE TREBA NEKAKO DOBITI OVAJ "answer", VALJDA MU POSTAVITI PITANJE
          amount: sourceAccount.amount,
          answer: ,
          destinationBankAccount: lastScannedData.cardNumber,
          sourceBankAccount: sourceAccount.cardNumber
        }
      );

      console.log(data);

      if (!data.moneyTransferStatus) {
        Toast.fail("Failed to transfer the money");
      }
      else {
        Toast.success("Transfer completed successfuly!", 0.7);
      }*/
    }
    catch (err) {
      Toast.fail("Error has occured. Please try again", 1);
    }

    setInsertAmountModalVisible(false);
    setSourceAccountForTransfer(null);
  };

  const delegateTransfer = async (sourceAccount) => {
    console.log("Source acc: ", sourceAccount);
    console.log("data from destination acc, ", lastScannedData);
    console.log("TEST", lastScannedData.dynamic);
    return lastScannedData.dynamic
      ? await initTransfer(sourceAccount)
      : await staticQRTransfer(sourceAccount);
  };

  const fetchData = async (result) => {
    if (result.search("cardNumber") != -1) {
      try {
        const parsedData = JSON.parse(result);
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
      console.log("SKENIRANI PODACI: " + result);
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
                }
                else {
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
          <List style={styles.choosingAmountList}>
            <Text style={styles.moduleTitleText}>
              Please insert the amount you want to transfer
            </Text>

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
            <Button
              onPress={() => {
                if (validateInputAmount(inputAmount) != true)
                  Toast.fail("The input amount is not in correct format", 0.05 * inputAmount.length);
                else {
                  setSecurityQuestionModalVisible(true);
                }
              }}

              title="Submit"
            />
          </List>
        </View>
      </Modal>

      <Modal
        transparent
        isVisible={securityQuestionModalVisible}
        onBackButtonPress={() => {
          setSecurityQuestionModalVisible(false); S
        }}
      >
        <View style={styles.modalInsertAmount}>
          <List style={styles.choosingAmountList}>
            <Text style={styles.moduleTitleText}>
              OVDJE IDE TEKST SECURITY PITANJA
            </Text>

            <View style={styles.row}>
              <View style={styles.rowMemberInput}>
                <InputItem
                  style={styles.listItem}
                  value={inputAnswer}

                  onChange={value => {
                    setInputAnswer(value);
                  }}

                  placeholder="Answer to security question"
                />
              </View>
            </View>

            <Button
              onPress={() => {
                //FUNKCIJA ZA VALIDIRANJE ODGOVORA NIJE IMPLEMENTIRANA
                if (validateSecurityQuestion(inputAnswer) != true) {
                  Toast.fail("The input answer is wrong", 0.05 * inputAnswer.length);
                  inputAnswer = "";
                }
                else {
                  //OVDJE JE POTREBNO PROVJERITI DA LI NA SOURCE ACCOUNTU IMA DOVOLJNO NOVCA
                  initTransfer({ ...sourceAccountForTransfer, amount: inputAmount });
                }
              }}

              title="Submit"
            />
          </List>
        </View>
      </Modal>

    </View>
  );
};

export default QRScanner;
