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

    const [filters, setFilters] = useState(["null", "accounts", "time", "merchants"]);
    const [chosenFilter, setChosenFilter] = useState(null);

    const Replacement = (text) => {
        if (text === "null")
            return "No filter";
        else if (text === "accounts")
            return "Fiter by account number";
        else if (text === "time")
            return "Fiter by payment time";
        else if (text === "merchants")
            return "Fiter by merchants";
        
    };


    return(

        <View style={styles.modal}>
            <ScrollView>
            <View style={styles.subheader}>
              <Text style={styles.subtitle}>Choose filter option</Text>
            </View>
            <List style={styles.list}>
              <Picker
                style={styles.listItem}
                onValueChange={(value) =>
                  setChosenFilter(
                    filters.find((filter) => filter === value)
                  )
                }
                selectedValue={chosenFilter}
              >
                {filters.map((filter, index) => (
                  <Picker.Item
                    label={`${Replacement(filter)}`}
                    value={filter}
                    key={index}
                  />
                ))}
              </Picker>
            </List>
            </ScrollView>
            <Button onPress={() => {setVisible(false); console.log(chosenFilter);}} 
            style={styles.button}
            activeStyle={{ backgroundColor: "#030852" }}
            type="primary">
                Select
            </Button>
        </View>




    );

};

export default FilterModal;