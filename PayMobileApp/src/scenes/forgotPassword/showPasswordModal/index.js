import React from "react";
import { View, Text } from "react-native";
import { Modal, Button } from "@ant-design/react-native";
import { Actions } from "react-native-router-flux";
import styles from "./styles";

const ShowPaswordModal = ({ setVisible, isVisible, message, password }) => {
  return (
    <Modal
      style={styles.body}
      transparent
      onClose={() => {
        Actions.pop();
        setVisible(false);
      }}
      maskClosable
      visible={isVisible}
      footer={null}
      bodyStyle={styles.body}
    >
      <View style={{ paddingVertical: 20 }}>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={{ paddingVertical: 20 }}>
        <Text style={styles.password}>{password}</Text>
      </View>
      <Button
        activeStyle={{ backgroundColor: "#030852" }}
        style={styles.button}
        type="primary"
        onPress={() => {
          Actions.pop();
          setVisible(false);
        }}
      >
        OK
      </Button>
    </Modal>
  );
};

export default ShowPaswordModal;
