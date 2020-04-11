import React, { useState, useEffect } from "react";
import styles from "./styles";
import { View, Text, ScrollView, TouchableOpacity, Picker } from "react-native";
import {
  List,
  Button,
  Icon,
  DatePicker,
  Toast
} from "@ant-design/react-native";
import Modal from "react-native-modal";
import axios from "axios";
import { BASE_URL } from "../../../../../app/apiConfig";
import { useAuthContext } from "../../../../../contexts/AuthContext";
import { Actions } from "react-native-router-flux";

const FilterModal = ({transactions, setTransactions, setVisible, visible, loading, setLoading, error, setError,
 pageNum, setPageNum, currentPage, setCurrentPage, activeNoFilter, setActiveNoFilter, activeAccountFilter, setActiveAccountFilter,
 activeMerchantFilter, setActiveMerchantFilter, activeTimeFilter, setActiveTimeFilter}) => {

    const [accounts, setAccounts] = useState([]);
    const [chosenAccount, setChosenAccount] = useState(null);
    const [merchants, setMerchants] = useState([]);
    const [chosenMerchant, setChosenMerchant] = useState(null);
    const [chosenNone, setChosenNone] = useState(false);
    const [chosenTime, setChosenTime] = useState(false);
    const [chosenAccountFilter, setChosenAccountFilter] = useState(false);
    const [chosenMerchantFilter, setChosenMerchantFilter] = useState(false);

    const { token, logOut } = useAuthContext();

    const buttonPressed = (text) => {
        if (text === "time") {
            setChosenTime(true);
            setChosenMerchantFilter(false);
            setChosenNone(false);
            setChosenAccountFilter(false);
            setActiveTimeFilter(true);
            setActiveNoFilter(false);
            setActiveAccountFilter(false);
            setActiveMerchantFilter(false);
        }
        else if (text === "null") {
            setChosenTime(false);
            setChosenMerchantFilter(false);
            setChosenNone(true);
            setChosenAccountFilter(false);
            setActiveTimeFilter(false);
            setActiveNoFilter(true);
            setActiveAccountFilter(false);
            setActiveMerchantFilter(false);
        }
        else if (text === "account") {
            setChosenTime(false);
            setChosenMerchantFilter(false);
            setChosenNone(false);
            setChosenAccountFilter(true);
            setChosenAccount(accounts[0]);
            setActiveTimeFilter(false);
            setActiveNoFilter(false);
            setActiveAccountFilter(true);
            setActiveMerchantFilter(false);
        }
        else if (text === "merchant") {
            setChosenTime(false);
            setChosenMerchantFilter(true);
            setChosenNone(false);
            setChosenAccountFilter(false);
            setChosenMerchant(merchants[0]);
            setActiveTimeFilter(false);
            setActiveNoFilter(false);
            setActiveAccountFilter(false);
            setActiveMerchantFilter(true);
        }
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
        //if (data.length > 0) setChosenAccount(data[0]);
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


    const loadMerchants = async () => {
      try {
        setError(null);
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}api/merchants/all`, {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        });
        setMerchants(data);
        //if (data.length > 0) setChosenMerchant(data[0]);
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


    const getTransactionsByAccount = async (accountId) => {
      try {
        setError(null);
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}api/transactions/bankAccount/${accountId}`, {
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


    const getTransactionsByMerchant = async (merchantName) => {
      try {
        setError(null);
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}api/transactions/merchant/${merchantName}`, {
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


    useEffect(() => {
      loadAccounts();
      loadMerchants();
    }, [Actions.currentScene]);


    return(

      <Modal
      isVisible={visible}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
    >

        <View style={styles.modal}>
            <ScrollView>

            <View style={styles.subheader}>
              <Text style={styles.subtitle}>Choose filter option</Text>
            </View>

            <View style={styles.selectHeader}>
            <View style={styles.buttonHeader}>
 
                {activeNoFilter ? (
                <Button 
                style={styles.button, styles.activeButton}
                type="primary"
                 onPress={() => {buttonPressed("null");}}>None</Button>
                ):
                <Button 
                style={styles.button}
                 onPress={() => {buttonPressed("null");}}>None</Button>
                }

                {activeTimeFilter ? (
                <Button 
                style={styles.button, styles.activeButton}
                type="primary"
                 onPress={() => {buttonPressed("time");}}>Time</Button>
                ):
                <Button 
                style={styles.button}
                 onPress={() => {buttonPressed("time");}}>Time</Button>
                }

            </View>
            <View style={styles.buttonHeader}>
                
              {activeAccountFilter ? (
                <Button 
                style={styles.button, styles.activeButton}
                type="primary"
                 onPress={() => {buttonPressed("account");}}>Accounts</Button>
                ):
                <Button 
                style={styles.button}
                 onPress={() => {buttonPressed("account");}}>Accounts</Button>
                }

                {activeMerchantFilter ? (
                <Button 
                style={styles.button, styles.activeButton}
                type="primary"
                 onPress={() => {buttonPressed("merchant");}}>Merchants</Button>
                ):
                <Button 
                style={styles.button}
                 onPress={() => {buttonPressed("merchant");}}>Merchants</Button>
                }

            </View>
            </View>


            {chosenAccountFilter ? (
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
          ) : null}


            {chosenMerchantFilter ? (
            <List style={styles.list}>
            <Picker
                style={styles.listItem}
                onValueChange={(value) =>
                  setChosenMerchant(
                    merchants.find((merchant) => merchant.merchantName === value)
                  )
                }
                selectedValue={chosenMerchant.merchantName}
              >
                {merchants.map((merchant, index) => (
                  <Picker.Item
                    label={`${merchant.merchantName}`}
                    value={merchant.merchantName}
                    key={index}
                  />
                ))}
              </Picker>
          </List>
          ) : null}


          { chosenTime ? (
              <View>
                  <Text>Datumi</Text>
              </View>
          ) : null}


          { chosenNone ? (
              <View>
                  <Text>No filter chosen</Text>
              </View>
          ) : null}


            </ScrollView>
            <Button onPress={async () => {
              if (activeTimeFilter || activeAccountFilter || activeMerchantFilter) {
              if (chosenAccountFilter)
                await getTransactionsByAccount(chosenAccount.id);
              else if (chosenMerchantFilter)
                await getTransactionsByMerchant(chosenMerchant.merchantName);
              else
                await loadTransactions();
              setVisible(false);
              setChosenTime(false);
              setChosenMerchantFilter(false);
              setChosenNone(false);
              setChosenAccountFilter(false);
              }
              else {
                Toast.fail("Please select a filter option.", 1);
              }
            }} 
            style={styles.nextButton}
            activeStyle={{ backgroundColor: "#030852" }}
            type="primary">
                Select
            </Button>
        </View>
        </Modal>




    );

};

export default FilterModal;