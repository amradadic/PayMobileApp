import React, { useState, useEffect } from "react";
import styles from "./styles";
import { View, Text, ScrollView, Picker } from "react-native";
import {Button} from "@ant-design/react-native";
import RadioButt from './components/RadioButt'

const SortModal = ({ setVisible, transaction }) => {
  
  const [checked, setChecked] = useState(null);
  const [fakeData, setFakeData] = useState(["ASCENDING", "DESCENDING"]);
  const [chosenFakeData, setChosenFakeData] = useState("ASCENDING");
//console.log(transaction); // transaction[0].cardNumber  , .date, .merchantName
 
  const sortPressed = (text,order) => {

    if(order == "ASCENDING")
    {
      if(text == "Bank Accaunt")
      {
      transaction.sort(function (a,b) {  
      
        return b.cardNumber > a.cardNumber ? -1
             : b.cardNumber < a.cardNumber ? 1
             : 0
        });
      }
      else if(text == "Time")
     {
      transaction.sort(function (a,b) {  
      
        return b.date > a.date ? -1
             : b.date < a.date ? 1
             : 0
      });
      }
      else if(text == "Merchant")
      {
      transaction.sort(function (a,b) {  // a to z ascending merchant
      
        return b.merchantName > a.merchantName ? -1
             : b.merchantName < a.merchantName ? 1
             : 0
      });
      }
    }
    else if(order == "DESCENDING")
    { 
      if(text == "Bank Accaunt")
      {
      transaction.sort(function (a,b) {  
      
        return b.cardNumber < a.cardNumber ? -1
             : b.cardNumber > a.cardNumber ? 1
             : 0
        });
      }
      else if(text == "Time")
      {
      transaction.sort(function (a,b) {  
      
        return b.date < a.date ? -1
             : b.date > a.date ? 1
             : 0
         });
      }
      else if(text == "Merchant")
      {
      transaction.sort(function (a,b) {  // z to a descending merchant
      
        return b.merchantName < a.merchantName ? -1
             : b.merchantName > a.merchantName ? 1
             : 0
       });
      }
    }
    
    /*console.log(transaction);
    console.log("SORTIRANO");
    console.log(order);*/
  }

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
      <Button onPress={() => { setVisible(false); sortPressed(checked,chosenFakeData) }} // NEDELJU ABD -> umjesto console.log ovdje pozvati fju koja provjerava sta je u opcijama izabrano ascendind i koji radio i onda obavlja nad podacima SORT ! U NEDELJU ABD OVO
        style={styles.nextButton}
        activeStyle={{ backgroundColor: "#030852" }}
        type="primary">
        Sort
            </Button>
    </View >




  );

};

export default SortModal;