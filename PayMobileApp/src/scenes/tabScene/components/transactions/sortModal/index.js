import React, { useState, useEffect } from "react";
import styles from "./styles";
import { View, Text, ScrollView, TouchableOpacity, Picker } from "react-native";
import {
  List,
  Button,
  Icon,
  DatePicker
} from "@ant-design/react-native";
import { RadioButton } from 'react-native-paper';
import RadioButt from './components/RadioButt'
import { Actions } from "react-native-router-flux";
import RadioForm from 'react-native-simple-radio-button';

const SortModal = ({ setVisible }) => {
  //  const [checked, setChecked] = useState('first');
  const [fakeData, setFakeData] = useState(["ASCENDING", "DESCENDING"]);

  const [chosenFakeData, setChosenFakeData] = useState(null);
  const [fakeData1, setFakeData1] = useState(["1", "2", "3", "4"]);
  const [chosenFakeData1, setChosenFakeData1] = useState(null);
  const [chosenNone, setChosenNone] = useState(false);
  const [chosenTime, setChosenTime] = useState(false);
  const [chosenAccount, setChosenAccount] = useState(false);
  const [chosenMerchant, setChosenMerchant] = useState(false);
  const [date, setDate] = useState(null);

  const buttonPressed = (text) => {
    /* if (text === "time") {
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
       setChosenFakeData(fakeData[0]);
     }
     else if (text === "merchant") {
       setChosenTime(false);
       setChosenMerchant(true);
       setChosenNone(false);
       setChosenAccount(false);
       setChosenFakeData1(fakeData1[0]);
     }*/
  }

  /*var radio_props = [
    { label: 'param1', value: 0 },
    { label: 'param2', value: 1 }
  ];*/


  const options = [
    {
      key: 'null',
      text: 'None',
    },
    {
      key: 'cardNumber',
      text: 'Bank Accaunt',
    },
    {
      key: 'time',
      text: 'Time',
    },
    {
      key: 'merchant',
      text: 'Merchant',
    }
  ];

  // const [checked, setChecked] = useState('Most High Pay');  ako zelimo da neki radio button vec bude kliknut, al ja ne zelim 

  const [checked, setChecked] = useState(null);
  const setSelectedRadio = (name) => {
    setChecked(name);
  }


  return (

    <View style={styles.modal}>
      <ScrollView>

        <View style={styles.subheader}>
          <Text style={styles.subtitle}>Choose sort option</Text>
        </View>

        <View >


          <RadioButt fun={setSelectedRadio} options={options} />






          <View style={styles.pickerHeader}>
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
          </View>
        </View>





      </ScrollView>
      <Button onPress={() => { setVisible(false); console.log(checked); }} // NEDELJU ABD -> umjesto console.log ovdje pozvati fju koja provjerava sta je u opcijama izabrano ascendind i koji radio i onda obavlja nad podacima SORT ! U NEDELJU ABD OVO
        style={styles.nextButton}
        activeStyle={{ backgroundColor: "#030852" }}
        type="primary">
        Sort
            </Button>
    </View >




  );

};

export default SortModal;