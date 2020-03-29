import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Modal, Button } from "@ant-design/react-native";
import styles from "./styles";

const ConfirmDeleteModal = ({ setVisible, isVisible, deleteAccount }) => {
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
        <Text style={styles.message}>
          Account is going to be deleted. Do you want to continue?
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button
          activeStyle={{ backgroundColor: "#030852" }}
          style={styles.button}
          type="primary"
          onPress={() => setVisible(false)}
        >
          Cancel
        </Button>
        <TouchableOpacity
          style={{
            ...styles.continueDeleteButton
          }}
          onPress={() => {
            deleteAccount();
            setVisible(false);
          }}
        >
          <Text
            style={{
              ...styles.continueDeleteButtonText,
              color: "#061178"
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;
