import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Accordion, List, Button, Modal } from "@ant-design/react-native";
import styles from "./styles";
import axios from "axios";
import { BASE_URL } from "../../../../app/apiConfig";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  const { token } = useAuthContext();

  const [activeSections, setActiveSections] = useState([0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onPress = key => {
    Modal.alert("Account will be deleted. Do you want to continue?", null, [
      {
        text: "Yes",
        onPress: () =>
          setAccounts(
            prevState =>
              prevState.filter(account => account.cardNumber !== key),
            serverDelete(account.id)
          ),

        style: { color: "red" }
      },
      {
        text: "NO",
        style: { color: "#061178" }
      }
    ]);
  };

  const loadAccounts = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}api/accounts/all`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      });
      data.expiryDate = new Date(
        Number(data.expiryDate.split("-")[0]),
        Number(data.expiryDate.split("-")[1]) - 1
      );
      console.log(data)
      setAccounts(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const serverDelete = async accountId => {
    //za token se radi get

    try {
      const { data } = await axios.delete(
        `${BASE_URL}api/accounts/delete/` + accountId``,
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }
      );
      console.log(data);
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (Actions.currentScene === "tabScene") {
      loadAccounts();
    }
  }, [Actions.currentScene]);

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>My Accounts</Text>
      </View>
      <View style={styles.background}>
        <Accordion
          onChange={value => setActiveSections(value)}
          activeSections={activeSections}
          style={styles.background}
        >
          {accounts.map((account, index) => (
            <Accordion.Panel key={index} header={account.accountOwner}>
              <List>
                <List.Item style={styles.listItem}>
                  {`Bank: ${account.bankName}`}
                </List.Item>
                <List.Item style={styles.listItem}>
                  {`Expiration Date: ${account.expiryDate}. ${account.expiryDate}.`}
                </List.Item>
                <List.Item style={styles.listItem}>
                  {`Card Number: ${account.cardNumber}`}
                </List.Item>
                <View style={styles.listItem}>
                  <Button
                    style={styles.button}
                    activeStyle={{ ...styles.button, backgroundColor: "white" }}
                    onPress={() => {
                      onPress(account.cardNumber);
                    }}
                  >
                    <Text style={{ color: "red" }}>Delete</Text>
                  </Button>
                </View>
              </List>
            </Accordion.Panel>
          ))}
        </Accordion>
      </View>
    </ScrollView>
  );
};

export default BankAccounts;
