import React, { useState } from "react";
import styles from "./styles";
import { View, Text, Picker } from "react-native";
import { Button, Radio, List } from "@ant-design/react-native";
const { RadioItem } = Radio;

const SortModal = ({ setVisible, setTransactions, setCurrentPage, checked, setChecked, selectedSortDirection, setSelectedSortDirection }) => {
  const sortDirections = ["Ascending", "Descending"];
  

  const sortPressed = () => {
    if (selectedSortDirection == "Ascending") {
      if (checked === "cardNumber") {
        setTransactions((prevState) =>
          prevState.sort((a, b) => {
            return b.cardNumber > a.cardNumber
              ? -1
              : b.cardNumber < a.cardNumber
              ? 1
              : 0;
          })
        );
      } else if (checked === "dateTime") {
        setTransactions((prevState) =>
          prevState.sort((a, b) => {
            return b.date > a.date ? -1 : b.date < a.date ? 1 : 0;
          })
        );
      } else if (checked === "merchantName") {
        setTransactions((prevState) =>
          prevState.sort((a, b) => {
            return b.merchantName > a.merchantName
              ? -1
              : b.merchantName < a.merchantName
              ? 1
              : 0;
          })
        );
      } else {
        setTransactions((prevState) =>
          prevState.sort((a, b) => {
            return b.transactionId < a.transactionId
              ? -1
              : b.transactionId > a.transactionId
              ? 1
              : 0;
          })
        );
      }
    } else if (selectedSortDirection == "Descending") {
      if (checked === "cardNumber") {
        setTransactions((prevState) =>
          prevState.sort((a, b) => {
            return b.cardNumber < a.cardNumber
              ? -1
              : b.cardNumber > a.cardNumber
              ? 1
              : 0;
          })
        );
      } else if (checked === "dateTime") {
        setTransactions((prevState) =>
          prevState.sort((a, b) => {
            return b.date < a.date ? -1 : b.date > a.date ? 1 : 0;
          })
        );
      } else if (checked === "merchantName") {
        setTransactions((prevState) =>
          prevState.sort((a, b) => {
            return b.merchantName < a.merchantName
              ? -1
              : b.merchantName > a.merchantName
              ? 1
              : 0;
          })
        );
      } else {
        setTransactions((prevState) =>
          prevState.sort((a, b) => {
            return b.transactionId < a.transactionId
              ? -1
              : b.transactionId > a.transactionId
              ? 1
              : 0;
          })
        );
      }
    }
  };

  const options = [
    {
      key: null,
      text: "None",
    },
    {
      key: "cardNumber",
      text: "Card number",
    },
    {
      key: "dateTime",
      text: "Date/Time",
    },
    {
      key: "merchantName",
      text: "Merchant name",
    },
  ];

  return (
    <View style={styles.modal}>
      <View style={styles.subheader}>
        <Text style={styles.subtitle}>Choose sort option</Text>
      </View>
      <View style={{ width: "100%" }}>
        {options.map((option, index) => (
          <List style={styles.radioButton} key={index}>
            <RadioItem
              onChange={(event) => {
                if (event.target.checked) {
                  setChecked(option.key);
                }
              }}
              checked={checked === option.key}
            >
              <Text
                style={{
                  fontSize: 16,
                  textAlignVertical: "center",
                  height: "100%",
                }}
              >
                {option.text}
              </Text>
            </RadioItem>
          </List>
        ))}

        <List style={styles.picker}>
          <Picker
            enabled={checked !== null}
            onValueChange={(value) => setSelectedSortDirection(value)}
            selectedValue={selectedSortDirection}
          >
            {sortDirections.map((direction, index) => (
              <Picker.Item label={direction} value={direction} key={index} />
            ))}
          </Picker>
        </List>
      </View>

      <Button
        onPress={() => {
          sortPressed();
          setVisible(false);
          setCurrentPage(1);
        }}
        style={styles.sortButton}
        activeStyle={{ backgroundColor: "#030852" }}
        type="primary"
      >
        Apply changes
      </Button>
    </View>
  );
};

export default SortModal;
