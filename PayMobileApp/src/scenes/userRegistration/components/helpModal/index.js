import React from "react";
import { View, Text } from "react-native";
import { Modal, Button } from "@ant-design/react-native";
import styles from "./styles";

const HelpModal = ({ setVisible, isVisible, message }) => {
  return (
    <Modal
      style={styles.body}
      transparent
      onClose={() => setVisible(false)}
      maskClosable
      visible={isVisible}
      footer={null}
      bodyStyle={styles.body}
    >
      <View style={{ paddingVertical: 20 }}>
        <Text style={styles.message}>{message}</Text>
      </View>
      <Button
        activeStyle={{ backgroundColor: "#030852" }}
        style={styles.button}
        type="primary"
        onPress={() => setVisible(false)}
      >
        OK
      </Button>
    </Modal>
  );
};

export default HelpModal;
