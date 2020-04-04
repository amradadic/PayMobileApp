import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { Button } from "@ant-design/react-native";

const AccountChooser = ({ data, onNextPressed }) => {
  const testAccountData = {
    ime: "",
    prezime: "",
    brojKartice: "",
    bankAccountId: "352",
  };

  console.log("ACCOUNT CHOOSER:");
  console.log("qr kod informacije:", data);

  return (
    <View style={styles.modal}>
      <View style={styles.innerContainer}>
        <Text>Podaci o skeniranom qr kodu se nalaze u konzoli</Text>
        <Text>Odaberite account</Text>
        <Button
          onPress={() => {
            onNextPressed(testAccountData);
          }}
        >
          Next
        </Button>
      </View>
    </View>
  );
};

export default AccountChooser;
