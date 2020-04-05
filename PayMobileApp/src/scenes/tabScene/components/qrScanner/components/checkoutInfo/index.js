import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { Button } from "@ant-design/react-native";

const CheckoutInfo = ({ accountData, transactionData }) => {
  return (
    <View style={styles.modal}>
      <View style={styles.innerContainer}>
        <Text>{JSON.stringify(accountData)}</Text>
        <Text>----------------</Text>
        <Text>{JSON.stringify(transactionData)}</Text>

        <Button>Submit payment</Button>
      </View>
    </View>
  );
};

export default CheckoutInfo;
