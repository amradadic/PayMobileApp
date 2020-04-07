import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import {
  Accordion,
  List,
  Button,
  Modal,
  ActivityIndicator,
  Toast,
} from "@ant-design/react-native";
import styles from "./styles";
import axios from "axios";
import { BASE_URL } from "../../../../app/apiConfig";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";
import TransferChooser from "./components/transferChooser";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  const { token, logOut } = useAuthContext();

  const [activeSections, setActiveSections] = useState([0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [accountSelected, setAccountSelected] = useState(null);

  const onTransferPressed = (account) => {
    setAccountSelected(account);
    setTransferModalVisible(true);
  };

  const onPress = (key) => {
    Modal.alert("Account will be deleted. Do you want to continue?", null, [
      {
        text: "Yes",
        onPress: () => deleteAccount(key),

        style: { color: "red" },
      },
      {
        text: "NO",
        style: { color: "#061178" },
      },
    ]);
  };

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
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const deleteAccount = async (accountId) => {
    try {
      setDeleting(true);
      const { data } = await axios.delete(
        `${BASE_URL}api/accounts/delete/${accountId}`,
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`,
          },
        }
      );
      if (data.success) {
        Toast.success(data.text, 0.7);
        loadAccounts();
      } else {
        Toast.fail(data.text, 0.7);
      }
    } catch (error) {
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
      Toast.fail("Error has occured. Please try again", 0.7);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [Actions.currentScene]);

  /**
 * 
 *       <Modal
        transparent
        isVisible={transferModalVisible}
        onBackButtonPress={() => {
          setTransferModalVisible(false);
        }}
      >
        <TransferChooser accountData={accountSelected}></TransferChooser>
      </Modal>
 * 
 */

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Accounts</Text>
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            paddingTop: 40,
          }}
        >
          <ActivityIndicator size="large" color="#061178" />
          {deleting ? (
            <Text style={{ paddingTop: 20, fontSize: 20, textAlign: "center" }}>
              Account is being deleted
            </Text>
          ) : null}
        </View>
      ) : error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
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
            paddingTop: 80,
            width: "100%",
          }}
        >
          <Text style={{ paddingTop: 10, fontSize: 20, textAlign: "center" }}>
            There aren't any registered accounts
          </Text>
        </View>
      ) : (
        <View style={styles.background}>
          <Accordion
            onChange={(value) => setActiveSections(value)}
            activeSections={activeSections}
            style={styles.background}
          >
            {accounts.map((account, index) => (
              <Accordion.Panel key={index} header={account.accountOwner}>
                <List>
                  <List.Item style={styles.listItem}>
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{ fontSize: 17 }}>Bank:</Text>
                      <Text style={{ fontSize: 17 }}>{account.bankName}</Text>
                    </View>
                  </List.Item>
                  <List.Item style={styles.listItem}>
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{ fontSize: 17 }}>Card Number:</Text>
                      <Text style={{ fontSize: 17 }}>{account.cardNumber}</Text>
                    </View>
                  </List.Item>
                  <List.Item style={styles.listItem}>
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{ fontSize: 17 }}>Expiration Date:</Text>
                      <Text style={{ fontSize: 17 }}>
                        {account.expiryDate.split("-")[1]}/
                        {account.expiryDate.split("-")[0]}
                      </Text>
                    </View>
                  </List.Item>
                  <View style={styles.listItem}>
                    <Button
                      style={styles.button}
                      activeStyle={{
                        ...styles.button,
                        backgroundColor: "white",
                      }}
                      onPress={() => {
                        onPress(account.id);
                      }}
                    >
                      <Text style={{ color: "red" }}>Delete</Text>
                    </Button>
                    <Button
                      activeStyle={{
                        ...styles.transferFundsButton,
                        backgroundColor: "white",
                      }}
                      onPress={() => {
                        onTransferPressed(account);
                      }}
                    >
                      <Text style={{ color: "#061178" }}>Transfer funds</Text>
                    </Button>
                  </View>
                </List>
              </Accordion.Panel>
            ))}
          </Accordion>
        </View>
      )}
    </ScrollView>
  );
};

export default BankAccounts;
