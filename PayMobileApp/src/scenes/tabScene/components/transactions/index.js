import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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
import { BASE_URL } from "../../../../app/apiConfig";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";
import TransactionDetailsModal from "./components/transactionDetailsModal";
import FilterModal from "./filterModal";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [noFilter, setNoFilter] = useState(true);
  const [accountFilter, setAccountFilter] = useState(false);
  const [merchantFilter, setMerchantFilter] = useState(false);
  const [timeFilter, setTimeFilter] = useState(false);

  const { token, logOut } = useAuthContext();

  const [activeSections, setActiveSections] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}api/transactions/all`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });
      setCurrentPage(1);
      setPageNum(parseInt(data.length / 10) + (data.length % 10 === 0 ? 0 : 1));
      setTransactions(data);
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
    await loadTransactions();
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
              <Text style={{ fontSize: 17 }}>{transaction.merchantName}</Text>
              <Text style={{ fontSize: 17 }}>
                {new Date(transaction.date.split("+")[0]).getDate()}.
                {new Date(transaction.date.split("+")[0]).getMonth()}.
                {new Date(transaction.date.split("+")[0]).getFullYear()}
              </Text>
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
                <Text style={{ fontSize: 17 }}>Total price:</Text>
                <Text style={{ fontSize: 17 }}>
                  {transaction.totalPrice.toFixed(2)} KM
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
                <Text style={{ fontSize: 17 }}>Card Number:</Text>
                <Text style={{ fontSize: 17 }}>{transaction.cardNumber}</Text>
              </View>
            </List.Item>
            <List.Item style={styles.listItem}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 17 }}>Time of transaction:</Text>
                <Text style={{ fontSize: 17 }}>
                  {new Date(transaction.date.split("+")[0]).getHours()}:
                  {new Date(transaction.date.split("+")[0]).getMinutes()}
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
                  setSelectedTransaction(transaction);
                  setDetailsVisible(true);
                  setShowOptions(false);
                }}
              >
                <Text style={{ color: "#061178" }}>Transaction details</Text>
              </Button>
            </View>
          </List>
        </Accordion.Panel>
      );
    }

    return items;
  };

  useEffect(() => {
    loadTransactions();
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
            <Text style={styles.title}>Transactions</Text>
            <Icon name={showOptions ? "up" : "down"} color="#061178" />
          </View>
        </TouchableOpacity>
        {showOptions ? (
          <>
            <View style={styles.options}>
              <TouchableOpacity
                disabled={loading}
                style={styles.optionsButton}
                onPress={() => {
                  setShowOptions(false);
                }}
              >
                <Text style={styles.optionsText}>Sort</Text>
                <Icon name="sort-ascending" color="#061178"/>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={loading}
                style={styles.optionsButton}
                onPress={() => {
                  setFilterModalVisible(true);
                  setShowOptions(false);
                }}
              >
                <Text style={styles.optionsText}>Filter</Text>
                <Icon name="filter" color="#061178"/>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
      <TransactionDetailsModal
        setVisible={setDetailsVisible}
        visible={detailsVisible}
        transactionData={selectedTransaction}
      />
      <FilterModal
        setVisible={setFilterModalVisible}
        visible={filterModalVisible}
        transactions={transactions}
        setTransactions={setTransactions}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        pageNum={pageNum}
        setPageNum={setPageNum}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        activeNoFilter={noFilter}
        setActiveNoFilter={setNoFilter}
        activeAccountFilter={accountFilter}
        setActiveAccountFilter={setAccountFilter}
        activeMerchantFilter={merchantFilter}
        setActiveMerchantFilter={setMerchantFilter}
        activeTimeFilter={timeFilter}
        setActiveTimeFilter={setTimeFilter}
      />
      {loading ? (
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
      ) : error ? (
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
            You haven't made any transactions yet
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

export default Transactions;
