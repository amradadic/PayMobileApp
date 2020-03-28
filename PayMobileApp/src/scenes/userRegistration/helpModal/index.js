import React from "react";
import { View, Text } from "react-native";
import { Modal, Button } from "@ant-design/react-native";
import styles from "./styles";

const HelpModal = ({setVisible, isVisible}) => {
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
        <Text style={styles.message}>Potvrdite svoju lozinku tako što ćete unijeti istu dva puta.</Text>
      </View>
      <Button style={styles.button} type="primary" onPress={() => setVisible(false)}>
        OK
      </Button>
    </Modal>
  );
};

export default HelpModal;