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
  ActivityIndicator,
  Button,
  Icon,
  InputItem,
  Toast,
  List,
} from "@ant-design/react-native";
import {
  validateRequired,
  validateLength,
  validateNumber,
} from "../../helperFunctions2";
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [errors, setErrors] = useState({
    balanceLowerLimit: null,
    monthlyLimit: null,
    transactionAmountLimit: null,
  });

  const [isCheckIconsVisible, setCheckIconsVisible] = useState({
    balanceLowerLimitCheckIcon: null,
    monthlyLimitCheckIcon: null,
    transactionAmountLimitCheckIcon: null,
  });

  const [
    isBalanceLowerLimitCheckIcon,
    setIsBalanceLowerLimitCheckIcon,
  ] = useState(false);
  const [isMonthlyLimitCheckIcon, setIsMonthlyLimitCheckIcon] = useState(false);
  const [
    isTransactionAmountLimitCheckIcon,
    setIsTransactionAmountLimitCheckIcon,
  ] = useState(false);

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

  const sendNewData = async (accountData) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}api/accounts/update/${accountData.id}`,
        {
          balanceLowerLimit: accountData.balanceLowerLimit,
          monthlyLimit: accountData.monthlyLimit,
          transactionAmountLimit: accountData.transactionAmountLimit,
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
      } else {
        console.log(error); //400 baci
        Toast.fail(
          "Failed to update account preferences. Check your inputs and try again",
          1
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  function showCheckIcon(trueFalseValue) {
    if (trueFalseValue != null && trueFalseValue == true) {
      const keyString = "someKey";
      return (
        <View style={styles.rowMemberIcon} key={keyString}>
          <Icon
            name="check-circle"
            color="#40EF6D"
            size="sm"
            onPress={() => Toast.success("The input is in correct format")}
          />
        </View>
      );
    }
  }

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

        {!showOptions ? null : loading ? null : error ? (
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

        {loading || !accountData ? (
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
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Text style={{ fontSize: 20, textAlign: "center", padding: 30 }}>
              Error has occured while loading. Please refresh and try again!
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.text}>Balance lower limit:</Text>
            <View style={styles.row}>
              <View style={styles.rowMemberInput}>
                <InputItem
                  placeholder="Positive number"
                  type="number"
                  style={styles.listItem}
                  error={errors.balanceLowerLimit}
                  onErrorClick={() =>
                    Toast.fail(
                      errors.balanceLowerLimit,
                      0.05 * errors.balanceLowerLimit.length
                    )
                  }
                  value={accountData.balanceLowerLimit.toString()}
                  onChange={(value) => {
                    if (value == "") value = "0";

                    if (
                      validateNumber(
                        value,
                        setErrors,
                        setCheckIconsVisible,
                        "balanceLowerLimit"
                      ) == true
                    )
                      setIsBalanceLowerLimitCheckIcon(true);
                    else setIsBalanceLowerLimitCheckIcon(false);

                    setAccountData((prevState) => ({
                      ...prevState,
                      balanceLowerLimit: value,
                    }));
                  }}
                />
              </View>
              {showCheckIcon(isBalanceLowerLimitCheckIcon)}
            </View>

            <Text style={styles.text}> Monthly limit:</Text>
            <View style={styles.row}>
              <View style={styles.rowMemberInput}>
                <InputItem
                  placeholder="Positive number"
                  type="number"
                  style={styles.listItem}
                  value={accountData.monthlyLimit.toString()}
                  error={errors.monthlyLimit}
                  onErrorClick={() =>
                    Toast.fail(
                      errors.monthlyLimit,
                      0.05 * errors.monthlyLimit.length
                    )
                  }
                  onChange={(value) => {
                    if (value == "") value = "0";

                    if (
                      validateNumber(
                        value,
                        setErrors,
                        setCheckIconsVisible,
                        "monthlyLimit"
                      ) == true
                    )
                      setIsMonthlyLimitCheckIcon(true);
                    else setIsMonthlyLimitCheckIcon(false);

                    setAccountData((prevState) => ({
                      ...prevState,
                      monthlyLimit: value,
                    }));
                  }}
                />
              </View>
              {showCheckIcon(isMonthlyLimitCheckIcon)}
            </View>

            <Text style={styles.text}>Transaction amount limit:</Text>
            <View style={styles.row}>
              <View style={styles.rowMemberInput}>
                <InputItem
                  placeholder="Positive number"
                  type="number"
                  style={styles.listItem}
                  value={accountData.transactionAmountLimit.toString()}
                  error={errors.transactionAmountLimit}
                  onErrorClick={() =>
                    Toast.fail(
                      errors.transactionAmountLimit,
                      0.05 * errors.transactionAmountLimit.length
                    )
                  }
                  onChange={(value) => {
                    if (value == "") value = "0";

                    if (
                      validateNumber(
                        value,
                        setErrors,
                        setCheckIconsVisible,
                        "transactionAmountLimit"
                      ) == true
                    )
                      setIsTransactionAmountLimitCheckIcon(true);
                    else setIsTransactionAmountLimitCheckIcon(false);

                    setAccountData((prevState) => ({
                      ...prevState,
                      transactionAmountLimit: value,
                    }));
                  }}
                />
              </View>
              {showCheckIcon(isTransactionAmountLimitCheckIcon)}
            </View>

            <Button
              activeStyle={{ backgroundColor: "#030852" }}
              style={styles.button}
              type="primary"
              loading={loading}
              disabled={loading}
              style={styles.button}
              onPress={async () => {
                if (
                  validateNumber(
                    accountData.transactionAmountLimit.toString(),
                    setErrors,
                    setCheckIconsVisible,
                    "transactionAmountLimit"
                  ) == true &&
                  validateNumber(
                    accountData.monthlyLimit.toString(),
                    setErrors,
                    setCheckIconsVisible,
                    "monthlyLimit"
                  ) == true &&
                  validateNumber(
                    accountData.balanceLowerLimit.toString(),
                    setErrors,
                    setCheckIconsVisible,
                    "balanceLowerLimit"
                  ) == true
                ) {
                  setLoading(true);
                  await sendNewData(accountData);
                } else setLoading(false);
              }}
            >
              SAVE CHANGES
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default AccountPreferences;
