import React from "react";
import { View, Text } from "react-native";
import { Modal, Button } from "@ant-design/react-native";
import styles from "./styles";
import { Actions } from 'react-native-router-flux';

const ConfirmModal = () => {
  return (
    <View>
      <View style={{ paddingVertical: 20 }}>
        <Text style={styles.message}>You have successfully recovered your password.</Text>
      </View>
      <Button
        style={styles.button}
        type="primary"
        onPress={() => Actions.replace("userLogin")}
      >
        OK
      </Button>
      </View>
  );
};

export default ConfirmModal;