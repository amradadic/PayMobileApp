import React, { useState, useEffect } from "react";
import styles from "./styles";
import { View, Text, ScrollView, TouchableOpacity, Picker } from "react-native";
import {
  List,
  Button,
  ActivityIndicator,
  Toast,
  Icon
} from "@ant-design/react-native";
import { Actions } from "react-native-router-flux";

const FilterModal = ({setVisible}) => {

    const [fakeData, setFakeData] = useState(["jedan", "dva", "tri", "cetiri"]);
    const [chosenFakeData, setChosenFakeData] = useState(null);
    const [fakeData1, setFakeData1] = useState(["1", "2", "3", "4"]);
    const [chosenFakeData1, setChosenFakeData1] = useState(null);
    const [chosenNone, setChosenNone] = useState(false);
    const [chosenTime, setChosenTime] = useState(false);
    const [chosenAccount, setChosenAccount] = useState(false);
    const [chosenMerchant, setChosenMerchant] = useState(false);
    const [showIcon, setShowIcon] = useState(false);

    const buttonPressed = (text) => {
        if (text === "time") {
            setChosenTime(true);
            setChosenMerchant(false);
            setChosenNone(false);
            setChosenAccount(false);
        }
        else if (text === "null") {
            setChosenTime(false);
            setChosenMerchant(false);
            setChosenNone(true);
            setChosenAccount(false);
        }
        else if (text === "account") {
            setChosenTime(false);
            setChosenMerchant(false);
            setChosenNone(false);
            setChosenAccount(true);
        }
        else if (text === "merchant") {
            setChosenTime(false);
            setChosenMerchant(true);
            setChosenNone(false);
            setChosenAccount(false);
        }
    }


    return(

        <View style={styles.modal}>
            <ScrollView>

            <View style={styles.subheader}>
              <Text style={styles.subtitle}>Choose filter option</Text>
            </View>

            <View style={styles.selectHeader}>
            <View style={styles.buttonHeader}>
                
                <Button style={styles.button} onPress={() => {buttonPressed("null")}}>
                    None
                </Button>

                <Button style={styles.button} onPress={() => {buttonPressed("time")}}>Time</Button>
            </View>
            <View style={styles.buttonHeader}>
                <Button style={styles.button} onPress={() => {buttonPressed("account")}}>Accounts</Button>
                <Button style={styles.button} onPress={() => {buttonPressed("merchant")}}>Merchants</Button>
            </View>
            </View>

            {chosenAccount ? (
            <List style={styles.list}>
            <Picker
              style={styles.listItem}
              onValueChange={(value) =>
                setChosenFakeData(
                  fakeData.find((fake) => fake === value)
                )
              }
              selectedValue={chosenFakeData}
            >
              {fakeData.map((fake, index) => (
                <Picker.Item
                  label={`${fake}`}
                  value={fake}
                  key={index}
                />
              ))}
            </Picker>
          </List>
          ) : null}

            {chosenMerchant ? (
            <List style={styles.list}>
            <Picker
              style={styles.listItem}
              onValueChange={(value) =>
                setChosenFakeData1(
                  fakeData1.find((fake) => fake === value)
                )
              }
              selectedValue={chosenFakeData1}
            >
              {fakeData1.map((fake, index) => (
                <Picker.Item
                  label={`${fake}`}
                  value={fake}
                  key={index}
                />
              ))}
            </Picker>
          </List>
          ) : null}

            </ScrollView>
            <Button onPress={() => {setVisible(false); console.log(chosenFakeData);}} 
            style={styles.nextButton}
            activeStyle={{ backgroundColor: "#030852" }}
            type="primary">
                Select
            </Button>
        </View>




    );

};

export default FilterModal;