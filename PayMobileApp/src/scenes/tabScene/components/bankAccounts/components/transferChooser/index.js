import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import styles from "./styles";

const TransferChooser = ({ account }) => {
  console.log(account);

  return (
    <View style={styles.modal}>
      <Text>Test</Text>
    </View>
  );
};
export default TransferChooser;
