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
                    <List.Item>{item.birth}</List.Item>
                    <List.Item>{item.name}</List.Item>
                    <List.Item>{item.key}</List.Item>
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
    padding: 5,
    fontWeight: 'bold'
  },
  item:{
    marginTop: 5,
    padding: 24,
    marginBottom:10,
    fontSize: 20,
    width:400,
    backgroundColor: '#f1f9fd'
  },
  button: {
  },
  background:{
    marginTop: 10,
    padding: 10,
    marginBottom:10,
   
    backgroundColor: '#f1f9fd'
  },
})
export default BankAccounts;
