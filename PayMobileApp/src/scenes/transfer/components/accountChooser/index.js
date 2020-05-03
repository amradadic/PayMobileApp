import React, { useState, useEffect } from "react";
import styles from "./styles";
import { BASE_URL } from "../../../../app/apiConfig";
import { View, Text, ScrollView, TouchableOpacity, Picker } from "react-native";
import {
  List,
  Button,
  ActivityIndicator,
  Toast
} from "@ant-design/react-native";
import axios from "axios";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";
import AccountChooser from "./components/accountChooser";

const AccountChooser = ({
  onNextPressed,
  setVisible,
}) => {
  const [accounts, setAccounts] = useState([]);

  const { token, logOut } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chosenAccount, setChosenAccount] = useState(null);
  

  const cancelPayment = async () => {
    setLoading(false);
  }

  const loadAccounts = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}api/accounts/all`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
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

  useEffect(() => {
    loadAccounts();
  }, [Actions.currentScene]);

  return (
    
    <View style={styles.modal}>
     
      <ScrollView>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              paddingTop: 40
            }}
          >
            <ActivityIndicator size="large" color="#061178" />
          </View>
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <Text style={{ fontSize: 20, textAlign: "center", padding: 30 }}>
              Error has occured while loading. Please refresh and try again!
            </Text>
          </View>
        ) : !accounts || accounts.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              paddingTop: 20,
              width: "100%"
            }}
          >
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              There aren't any registered accounts
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.subheader}>
              <Text style={styles.subtitle}>Choose your account</Text>
            </View>
            <List style={styles.list}>
              <Picker
                style={styles.listItem}
                onValueChange={(value) =>
                  setChosenAccount(
                    accounts.find((account) => account.cardNumber === value)
                  )
                }
                selectedValue={chosenAccount.cardNumber}
              >
                {accounts.map((account, index) => (
                  <Picker.Item
                    label={`${account.bankName}  \n${account.cardNumber}`}
                    value={account.cardNumber}
                    key={index}
                  />
                ))}
              </Picker>
            </List>
          </>
        )}
      </ScrollView>
      <Button
        disabled={loading}
        activeStyle={{ backgroundColor: "#030852" }}
        style={styles.button}
        type="primary"
        onPress={() => {
          if (!accounts || accounts.length === 0) setVisible(false);
          else onNextPressed(chosenAccount);
        }}
      >
        {!accounts || accounts.length === 0 ? "Ok" : "Next"}
      </Button>

      <TouchableOpacity
        style={{
          ...styles.backButton
        }}
        onPress={cancelPayment}
      >
        <Text
          style={{
            ...styles.backButtonText
          }}
        >
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountChooser;
