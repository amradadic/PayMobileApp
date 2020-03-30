import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Modal, Button } from "@ant-design/react-native";
import styles from "./styles";
import { Actions } from "react-native-router-flux";
import { useAuthContext } from "../../../../contexts/AuthContext";

const HelpModal = ({ setVisible, isVisible, message }) => {
  const { logOut } = useAuthContext();

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
      <View style={{flexDirection: "row", justifyContent:"space-around"}}>
      <TouchableOpacity
        style={{
          ...styles.OkButton,
        }}
        onPress={() => {
          logOut();
          setVisible(false);
          Actions.reset("userLogin")
        }}
      >
        <Text
          style={{
            ...styles.OkButtonText,
          }}
        >
          Log Out
        </Text>
      </TouchableOpacity>
      <Button
        activeStyle={{ backgroundColor: "#030852" }}
        style={styles.button}
        type="primary"
        onPress={() => setVisible(false)}
      >
        Cancel
      </Button>
      </View>

    </Modal>
  );
};

export default HelpModal;
