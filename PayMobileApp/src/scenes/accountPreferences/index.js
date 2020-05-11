import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Picker,
} from "react-native";
import {
  Accordion,
  List,
  ActivityIndicator,
  Pagination,
  Button,
  Icon,
  InputItem,
} from "@ant-design/react-native";
import styles from "./styles";
import axios from "axios";
import { BASE_URL } from "../../app/apiConfig";
import { useAuthContext } from "../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";

const AccountPreferences = () => {
  const [accounts, setAccounts] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const { token, logOut } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState();
  const [preferences, setPreferences] = useState({
    balanceLowLimit: null,
    monthlyLimit: null,
    transactionAmmountLimit: null,
  });
  

  const loadAccounts = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}api/accounts/all`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });
      setAccounts(data);
      if (data.length > 0) setChosenAccount(data[0]);
    } catch (error) {
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setShowOptions(false);
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const sendNewData = async (accountData) => { //accountData je onaj(bi trebao biti) selektovani
    //ne poziva se nigdje jos
    try {
      const chosenAccount = {
        accountOwner: form.accountOwner,
        bankName: "bank",
        expiryDate: `${accountData.expirationDate.getDate()}.${
          accountData.expirationDate.getMonth() + 1
        }.${accountData.expirationDate.getFullYear()}`,
        cvc: accountData.cvc.toString(),
        cardNumber: accountData.cardNumber.toString(),
        monthlyLimit: accountData.monthlyLimit,
        balanceLowerLimit: accountData.balanceLowerLimit,
        transactionAmmountLimit: accountData.transactionAmmountLimit
      };
      const { data } = await axios.post(
        `${BASE_URL}api/accounts/update/{bankAccountId}`,
        { ...chosenAccount },
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`,
          },
        }
      );
      if (!data.success) Toast.fail(data.text, 1);
      else {
        Toast.success("Successfully updated account preferences!", 0.7);
        setTimeout(() => Actions.pop(), 700);
      }
    } catch (error) {
      if (error.message.includes("404"))
        Toast.fail("Bank account does not exist", 1);
      else if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      } else
        Toast.fail("Failed to update account preferences. Check your inputs and try again", 1);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowOptions((prevState) => !prevState)}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Preferences</Text>
            <Icon name={showOptions ? "up" : "down"} color="#061178" />
          </View>
        </TouchableOpacity>
        {!showOptions ? null : accountsLoading ? null : accountsError ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "#d6e4ff",
              justifyContent: "center",
              alignContent: "center",
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 20, textAlign: "center", padding: 20 }}>
              Error has occured while loading accounts. Please refresh and try
              again!
            </Text>
          </View>
        ) : !accounts || accounts.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              paddingVertical: 20,
              width: "100%",
              backgroundColor: "#d6e4ff",
            }}
          >
            <Text style={{ paddingTop: 10, fontSize: 20, textAlign: "center" }}>
              You don't have any registered accounts
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#d6e4ff",
            }}
          >
            <View style={{ margin: 10, backgroundColor: "#f0f5ff" }}>
              <Text
                style={{
                  padding: 10,
                  fontSize: 17,
                  backgroundColor: "#d6e4ff",
                }}
              >
                Select your account
              </Text>
              <Picker
                onValueChange={async (value) => {
                  setAccountData(
                    accounts.find((account) => account.cardNumber === value)
                  );
                  await loadTransactions();
                }}
                selectedValue={accountData.cardNumber}
              >
                {accounts.map((account, index) => (
                  <Picker.Item
                    label={`${account.cardNumber}`}
                    value={account.cardNumber}
                    key={index}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}
        <Text>kraj</Text>
        <View>
          <Text>Balance lower limit: </Text>
          <InputItem></InputItem>
        </View>
        <View>
          <Text>MonthlyLimit: </Text>
          <InputItem></InputItem>
        </View>
        <View >
          <Text>Transaction ammount limit: </Text>
          <InputItem></InputItem>
        </View>


        <View style={styles.optionsButton}>
          <Button style={styles.button}>Cancel</Button>
          <Button style={styles.nextButton}
            activeStyle={{ backgroundColor: "#030852" }}
            type="primary">
              Save changes
            </Button>
        </View>
      </View>

    </ScrollView>
  );
};

export default AccountPreferences;
