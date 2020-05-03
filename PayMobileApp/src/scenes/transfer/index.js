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
import { BASE_URL } from "../../app/apiConfig";
import { useAuthContext } from "../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";



const Transfer = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [accountData, setAccountData] = useState(null);


  const { token, logOut } = useAuthContext();

  const [activeSections, setActiveSections] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [accountChooserModalVisible, setAccountChooserModalVisible] = useState(
    false
  );



  const loadTransactions = async () => {
    try {
      setError(null);
      setLoading(true);
      
     
      
      const { data } = await axios.get(`${BASE_URL}api/accounts/moneyTransfer/allSends/${accountData.id}`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });
      setCurrentPage(1);
      console.log("data: ");
      
      console.log(data.transfers);
      setPageNum(parseInt(data.transfers.length / 10) + (data.transfers.length % 10 === 0 ? 0 : 1));
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

  const hideAccountChooserModal = () => {
    setAccountChooserModalVisible(false);
    
  };
  const setChosenAccountData = (accountData) => {
    setAccountData(accountData);
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
                <Text style={{ fontSize: 17 }}>{transaction.paymentStatus}</Text>
              </View>
            </List.Item>
            <List.Item style={styles.listItem}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 17 }}>Time of transfer:</Text>
                <Text style={{ fontSize: 17 }}>
                  {transaction.transferDateAndTime }
                  
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
    loadTransactions();
  }, [Actions.currentScene]);

  return (
   
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    ><Modal
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
      <View>
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
        <TouchableOpacity
          activeOpacity={0.9}
          
        >
          <View style={styles.header}>
            <Text style={styles.title}>Transfers</Text>
            <Icon name={showOptions ? "up" : "down"} color="#061178" />
          </View>
        </TouchableOpacity>
       
      </View>
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
