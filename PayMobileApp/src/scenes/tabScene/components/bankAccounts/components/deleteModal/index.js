import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Modal, Button, Toast } from "@ant-design/react-native";
import styles from "./styles";
import { Actions } from "react-native-router-flux";
import axios from "axios";
import { BASE_URL } from "../../../../../../app/apiConfig";

import { useAuthContext } from "../../../../../../contexts/AuthContext";

const DeleteModal = ({
  setVisible,
  isVisible,
  loadAccounts,
  setDeleting,
  deleting,
  account,
}) => {
  const { logOut, token } = useAuthContext();
  const deleteAccount = async () => {
    try {
      setDeleting(true);
      const { data } = await axios.delete(
        `${BASE_URL}api/accounts/delete/${account.id}`,
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`,
          },
        }
      );
      if (data.success) {
        Toast.success(data.text, 0.7);
        loadAccounts();
      } else {
        Toast.fail(data.text, 0.7);
      }
    } catch (error) {
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
      Toast.fail("Error has occured. Please try again", 0.7);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      style={styles.body}
      transparent
      onClose={() => setVisible(false)}
      maskClosable={false}
      visible={isVisible}
      footer={null}
      bodyStyle={styles.body}
    >
      <View style={{ paddingVertical: 20 }}>
        <Text style={styles.message}>
          Account will be removed. Do you want to continue?
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          disabled={deleting}
          style={{
            ...styles.OkButton,
            borderColor: deleting ? "#95A5A6" : "#061178",
          }}
          onPress={async () => {
            await deleteAccount();
            setVisible(false);
          }}
        >
          <Text
            style={{
              ...styles.OkButtonText,
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
        <Button
          disabled={deleting}
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

export default DeleteModal;
