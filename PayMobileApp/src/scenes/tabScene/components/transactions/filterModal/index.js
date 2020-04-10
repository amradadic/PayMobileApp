import React, { useState, useEffect } from "react";
import styles from "./styles";
import { View, Text, ScrollView, TouchableOpacity, Picker } from "react-native";
import {
  List,
  Button,
  ActivityIndicator,
  Toast,
} from "@ant-design/react-native";
import { Actions } from "react-native-router-flux";

const FilterModal = ({setVisible}) => {

    const [fakeData, setFakeData] = useState(["jedan", "dva", "tri", "cetiri"]);
    const [chosenFakeData, setChosenFakeData] = useState(null);
    const [chosenFilter, setChosenFilter] = useState(null);
    const [showIcon, setShowIcon] = useState(false);

    const buttonPressed = (text) => {
        setChosenFilter(text);
    }


    return(

        <View style={styles.modal}>
            <ScrollView>

            <View style={styles.subheader}>
              <Text style={styles.subtitle}>Choose filter option</Text>
            </View>

            <View style={styles.selectHeader}>
            <View style={styles.buttonHeader}>
                <Button style={styles.button} onPress={() => {buttonPressed("null")}}>None</Button>
                <Button style={styles.button} onPress={() => {buttonPressed("time")}}>Time</Button>
            </View>
            <View style={styles.buttonHeader}>
                <Button style={styles.button} onPress={() => {buttonPressed("account")}}>Accounts</Button>
                <Button style={styles.button} onPress={() => {buttonPressed("merchant")}}>Merchants</Button>
            </View>
            </View>

            {chosenFilter ? (
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