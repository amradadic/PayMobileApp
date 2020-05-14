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
  Toast,
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
  const [balanceLowerLimit, setBalanceLowerLimit] = useState(null);
  const [monthlyLimit, setMonthlyLimit] = useState(null);
  const [transactionAmountLimit, setTransactionAmountLimit] = useState(null);
  

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
      if (data.length > 0) setAccountData(data[0]);
      setBalanceLowerLimit(accountData.balanceLowerLimit);
      setMonthlyLimit(accountData.monthlyLimit);
      setTransactionAmountLimit(accountData.transactionAmountLimit);
      console.log(accountData);
      console.log("Donji limit: " + balanceLowerLimit);
      console.log("Mjesecni limit: " + monthlyLimit);
      console.log("Transakcijski limit: " + transactionAmountLimit);
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

  const sendNewData = async (accountData, balanceLowerLimit, monthlyLimit, transactionAmountLimit) => { 
    
    try { 
      const { data } = await axios.post(
        `${BASE_URL}api/accounts/update/${accountData.id}`,
        { balanceLowerLimit,
          monthlyLimit,
          transactionAmountLimit
        },
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
      } else{
      console.log(error); //400 baci
        Toast.fail("Failed to update account preferences. Check your inputs and try again", 1);}
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    loadAccounts();
  }, [Actions.currentScene]);

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
                  setBalanceLowerLimit(accountData.balanceLowerLimit);
                  setMonthlyLimit(accountData.monthlyLimit);
                  setTransactionAmountLimit(accountData.transactionAmountLimit);
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
        <View>
          <InputItem
            type = "number"
            textAlign = "left"
          
           defaultValue = {balanceLowerLimit.toString()}
             selectedValue = {balanceLowerLimit}
           onValueChange = {async (value) => {
            setBalanceLowerLimit(value);
          }}

         
            >Balance lower limit:</InputItem>
        </View>
        <View >
          <InputItem
            type = "number"
            defaultValue = {monthlyLimit.toString()}
              selectedValue = {monthlyLimit}
                onValueChange = {async (value) => {
                  setMonthlyLimit(value);
                }}
            >Monthly limit:</InputItem>
        </View>
        <View >
          <InputItem
            type = "number"
            defaultValue = {transactionAmountLimit.toString()}
              selectedValue = {transactionAmountLimit}
                onValueChange = {async (value) => {
                  setTransactionAmountLimit(value);
                }}
            >Transaction ammount limit:</InputItem>
        </View>

       
          
          <Button 
           activeStyle={{ backgroundColor: "#030852" }}
           style={styles.button}
            type="primary"
            loading={loading}
            disabled={loading}
            style={styles.button}
            onPress={async (accountData) => {
              setLoading(true);
              //const isValid = validateForm(form, setErrors);
              //if (isValid) {
                await sendNewData(accountData, balanceLowerLimit, monthlyLimit, transactionAmountLimit);
              //} else setLoading(false);
              
            }}>
              SAVE CHANGES
            </Button>
      </View>

    </ScrollView>
  );
};

export default AccountPreferences;
