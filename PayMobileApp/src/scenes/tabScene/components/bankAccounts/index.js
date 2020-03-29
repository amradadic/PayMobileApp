import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ConfirmDeleteModal from "./confirmDeleteModal";
import { Accordion, List, Button, Modal } from "@ant-design/react-native";
import styles from "./styles";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([
    {
      cardNumber: 1234567812345678,
      expriationDate: new Date(),
      accountOwner: "Ime prezime"
    },
    {
      cardNumber: 8765432187654321,
      expriationDate: new Date(),
      accountOwner: "Ime2 prezime2"
    }
  ]);

  const [activeSections, setActiveSections] = useState([0]);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const deleteBtn = key => {
    Modal.alert("Account will be deleted. Do you want to continue?", null, [
      {
        text: "Yes",
        onPress: () =>
          setAccounts(prevState =>
            prevState.filter(account => account.cardNumber !== key)
          ),
        style: { color: "red" }
      },
      {
        text: "NO",
        style: { color: "#061178" }
      }
    ]);
  };
  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>My Accounts</Text>
      </View>
      <View style={styles.background}>
        <Accordion
          onChange={value => setActiveSections(value)}
          activeSections={activeSections}
          style={styles.background}
        >
          {accounts.map((account, index) => (
            <Accordion.Panel key={index} header={account.accountOwner}>
              <List>
                <List.Item style={styles.listItem}>
                  {`Account Owner: ${account.accountOwner}`}
                </List.Item>
                <List.Item style={styles.listItem}>
                  {`Expiration Date: ${account.expriationDate.getMonth()}. ${account.expriationDate.getFullYear()}.`}
                </List.Item>
                <List.Item style={styles.listItem}>
                  {`Card Number: ${account.cardNumber}`}
                </List.Item>
                <View style={styles.listItem}>
                  <Button
                    style={styles.button}
                    activeStyle={{ ...styles.button, backgroundColor: "white" }}
                    onPress={() => {
                      deleteBtn(account.cardNumber);
                    }}
                  >
                    <Text style={{ color: "red" }}>Delete</Text>
                  </Button>
                </View>
              </List>
            </Accordion.Panel>
          ))}
        </Accordion>
      </View>
    </ScrollView>
  );
};

export default BankAccounts;
