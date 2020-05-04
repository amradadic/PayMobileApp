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
} from "@ant-design/react-native";
import styles from "./styles";
import axios from "axios";
import { BASE_URL } from "../../app/apiConfig";
import { useAuthContext } from "../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";

const Transfer = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [accountData, setAccountData] = useState(null);

  const { token, logOut } = useAuthContext();

  const [activeSections, setActiveSections] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [direction, setDirection] = useState("allSends");

  const loadTransactions = async (accountDataParam) => {
    try {
      setError(null);
      setLoading(true);
      console.log(
        `${BASE_URL}api/accounts/moneyTransfer/${direction}/${
          accountDataParam ? accountDataParam.id : accountData.id
        }`
      );
      const { data } = await axios.get(
        `${BASE_URL}api/accounts/moneyTransfer/${direction}/${
          accountDataParam ? accountDataParam.id : accountData.id
        }`,
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`,
          },
        }
      );
      console.log(data)
      setCurrentPage(1);
      setPageNum(
        parseInt(data.transfers.length / 10) +
          (data.transfers.length % 10 === 0 ? 0 : 1)
      );
      setTransactions(data.transfers);
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

  const loadAccounts = async () => {
    try {
      setAccountsError(null);
      setAccountsLoading(true);
      const { data } = await axios.get(`${BASE_URL}api/accounts/all`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });

      setAccounts(data);
      if (data.length > 0) {
        setAccountData(data[0]);
        await loadTransactions(data[0]);
      }
    } catch (error) {
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
      setAccountsError(error);
    } finally {
      setAccountsLoading(false);
    }
  };

  const onRefresh = async () => {
    setShowOptions(false);
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const renderList = () => {
    let items = [];
    for (
      let index = (currentPage - 1) * 10;
      index <
      (transactions.length < currentPage * 10
        ? transactions.length
        : currentPage * 10);
      index++
    ) {
      const transaction = transactions[index];
      items.push(
        <Accordion.Panel
          key={index}
          header={
            <View style={styles.accordionPanelHeader}>
              <Text style={{ fontSize: 17 }}>{transaction.destCardNumber}</Text>
            </View>
          }
        >
          <List>
            <List.Item style={styles.listItem}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 17 }}>Amount transfered:</Text>
                <Text style={{ fontSize: 17 }}>
                  {transaction.amount.toFixed(2)} KM
                </Text>
              </View>
            </List.Item>
            <List.Item style={styles.listItem}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 17 }}>Payment status:</Text>
                <Text style={{ fontSize: 17 }}>
                  {transaction.paymentStatus}
                </Text>
              </View>
            </List.Item>
            <List.Item style={styles.listItem}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 17 }}>Date/Time:</Text>
                <Text style={{ fontSize: 17 }}>
                  {transaction.transferDateAndTime}
                </Text>
              </View>
            </List.Item>
          </List>
        </Accordion.Panel>
      );
    }

    return items;
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
            <Text style={styles.title}>Transfers</Text>
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

              <Text
                style={{
                  paddingTop: 30,
                  padding: 10,
                  fontSize: 17,
                  backgroundColor: "#d6e4ff",
                }}
              >
                Select payment direction
              </Text>
              <Picker
                style={styles.listItem}
                onValueChange={async (value) => {
                  setDirection(value);
                  await loadTransactions();
                }}
                selectedValue={direction}
              >
                {[
                  { value: "Payments", key: "allSends" },
                  { value: "Receivements", key: "allReceives" },
                ].map((item, index) => (
                  <Picker.Item
                    label={item.value}
                    value={item.key}
                    key={index}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}
      </View>

      {loading || accountsLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            paddingTop: 60,
          }}
        >
          <ActivityIndicator size="large" color="#061178" />
        </View>
      ) : error || accountsError ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", padding: 30 }}>
            Error has occured while loading. Please refresh and try again!
          </Text>
        </View>
      ) : !transactions || transactions.length === 0 ? (
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
            You haven't made any transfers yet
          </Text>
        </View>
      ) : (
        <View style={styles.background}>
          <Accordion
            onChange={(value) => {
              setActiveSections(value);
              setShowOptions(false);
            }}
            activeSections={activeSections}
            style={styles.background}
          >
            {renderList()}
          </Accordion>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              padding: 5,
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              disabled={loading || currentPage === 1}
              style={styles.paginationButton}
              onPress={() => {
                setActiveSections([]);
                setShowOptions(false);
                setCurrentPage((prevState) => prevState - 1);
              }}
            >
              <Icon
                name="left"
                color={loading || currentPage === 1 ? "#95A5A6" : "#061178"}
              />
            </TouchableOpacity>
            <Pagination
              total={pageNum}
              style={{ paddingHorizontal: 40 }}
              current={currentPage}
              mode="number"
            />
            <TouchableOpacity
              disabled={loading || currentPage === pageNum}
              style={styles.paginationButton}
              onPress={() => {
                setActiveSections([]);
                setShowOptions(false);
                setCurrentPage((prevState) => prevState + 1);
              }}
            >
              <Icon
                name="right"
                color={
                  loading || currentPage === pageNum ? "#95A5A6" : "#061178"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Transfer;
