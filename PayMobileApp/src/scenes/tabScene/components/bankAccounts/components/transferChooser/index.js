import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import styles from "./styles";

const TransferChooser = ({ accountData }) => {
  console.log(accountData);

  return (
    <View style={styles.modal}>
      {console.log("tu")}
      <Text>Test</Text>
    </View>
  );
};
export default TransferChooser;
