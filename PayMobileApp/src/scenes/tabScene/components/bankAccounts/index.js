import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView , Button} from "react-native";
import { Accordion, List , AccordionPanel } from '@ant-design/react-native';


const BankAccounts = () => {
  const [accounts, setAccounts] = useState([
    {name:'amra',birth:'1999', key: '1'},
    {name: 'ilma',birth:'1996', key: '2'}
  ]);

const [activeSections, setActiveSections] = useState([0]);

const deleteBtn = (key) => {
  setAccounts((acc) =>{
    return acc.filter(number => number.key != key)
  })
}
  return(
  <View>
    <Text style={styles.title}>Credit/Debit cards</Text>
      <ScrollView>
        <View>
          <Accordion
            onChange={(value) => setActiveSections(value)}
            activeSections = {activeSections}
            style = {styles.background}
          >
            {accounts.map((item) =>{
              return(   
                <AccordionPanel key = {item.key} style={styles.item} header ={item.name}> 
                  <List>
                    <List.Item>Account Owner: { item.birth}</List.Item>
                    <List.Item>Expiration Date: {item.name}</List.Item>
                    <List.Item>Card Number: {item.key}</List.Item>
                     <List.Item>
                      <View style = {styles.button}>
                        <Button title = '                                                         Delete' color = 'red' onPress={() => deleteBtn(item.key)} />
                      </View>
                    </List.Item>
                  </List>
                </AccordionPanel>
              )
            })}
          </Accordion>
        </View>
      </ScrollView>
  </View>
)};

const styles = StyleSheet.create({
  title: {
    marginTop:0,
    textAlign: 'center',
    fontSize:20
  },
  item:{
    marginTop: 0,
    padding: 7,
    marginBottom: 15,
    fontSize: 20,
    width:400,
    
    backgroundColor: '#f0f5ff'
  },
  button: {
  },
  background:{
    marginTop: 10,
    padding: 7,
    marginBottom:10,
    backgroundColor: '#f0f5ff'
  },
})
export default BankAccounts;
