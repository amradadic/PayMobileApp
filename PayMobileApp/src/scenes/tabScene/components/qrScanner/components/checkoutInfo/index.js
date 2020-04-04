import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { Button } from "@ant-design/react-native";

const CheckoutInfo = ({ accountData, transactionData }) => {
  console.log("CHECKOUT INFO:");
  console.log("podaci o accountu: ", accountData);
  console.log("podaci o transakciji: ", transactionData);

  return (
    <View style={styles.modal}>
      <View style={styles.innerContainer}>
        <Text>
          Podaci iz prethodnih koraka i o odabranom accountu se nalaze u konzoli
        </Text>

        <Button>Submit payment</Button>
      </View>
    </View>
  );
};

export default CheckoutInfo;
