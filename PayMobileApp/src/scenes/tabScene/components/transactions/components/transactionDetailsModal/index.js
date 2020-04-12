import React from "react";
import { View, Text, ScrollView } from "react-native";
import Modal from "react-native-modal";
import styles from "./styles";
import { Button, List } from "@ant-design/react-native";

const TransactionDetailsModal = ({ transactionData, setVisible, visible }) => {
  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
    >
      <View style={styles.modal}>
        <View style={styles.subheader}>
          <Text style={styles.subtitle}>Transaction details</Text>
        </View>
        <View style={styles.additionalData}>
          <Text style={styles.additionalDataText}>
            {transactionData ? transactionData.transactionId : ""}
          </Text>
        </View>
        <View style={styles.additionalData}>
          <Text style={styles.additionalDataText}>Card number:</Text>
          <Text style={styles.additionalDataText}>
            {transactionData ? transactionData.cardNumber : ""}
          </Text>
        </View>
        <View style={styles.additionalData}>
          <Text style={styles.additionalDataText}>Merchant:</Text>
          <Text style={styles.additionalDataText}>
            {transactionData ? transactionData.merchantName : ""}
          </Text>
        </View>
        <View style={styles.additionalData}>
        <Text style={styles.additionalDataText}>Date/Time:</Text>
          <Text style={styles.additionalDataText}>
            {transactionData
              ? new Date(transactionData.date.split("+")[0]).getDate() +
                "." +
                new Date(transactionData.date.split("+")[0]).getMonth() +
                "." +
                new Date(transactionData.date.split("+")[0]).getFullYear() +
                "/" +
                new Date(transactionData.date.split("+")[0]).getHours() +
                ":" +
                new Date(transactionData.date.split("+")[0]).getMinutes()
              : ""}
          </Text>
        </View>

        <ScrollView
          style={{
            height: 200,
            marginVertical: 20,
          }}
        >
          <List style={styles.list}>
            {transactionData
              ? transactionData.service.split(",").map((item, index) => {
                  return <List.Item key={index}>{item}</List.Item>;
                })
              : []}
          </List>
        </ScrollView>
        <View style={styles.additionalData}>
          <Text style={styles.additionalDataText}>Total amount:</Text>
          <Text style={styles.additionalDataText}>
            {transactionData ? transactionData.totalPrice.toFixed(2) : 0} KM
          </Text>
        </View>

        <Button
          activeStyle={{ backgroundColor: "#030852" }}
          style={styles.button}
          type="primary"
          onPress={() => {
            setVisible(false);
          }}
        >
          Back
        </Button>
      </View>
    </Modal>
  );
};

export default TransactionDetailsModal;
