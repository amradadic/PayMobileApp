import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView,TouchableOpacity  } from "react-native";
///import { Accordion } from "antd-mobile";
import { Accordion, List , AccordionPanel} from '@ant-design/react-native';


const BankAccounts = () => {
  const [accounts, setAccounts] = useState([
    {name:'amra',birth:'1999', key: '1'},
    {name: 'ilma',birth:'1996', key: '2'}
  ]);

  const [activeSections, setActiveSections] = useState([0]);


    
   
//tik iznad accordion panel
  
console.log(activeSections);
  return(
  <View>
    <Text style={styles.title}>Credit/Debit cards</Text>
    
      <ScrollView>
      <View >
              <Accordion
              onChange={(value) => setActiveSections(value)}
              activeSections = {activeSections}
              >
        {accounts.map((item) =>{
          return(
            
                  <AccordionPanel key = {item.key} style={styles.item} header ={item.name}> 
                    <List>
                      <List.Item>{item.birth}</List.Item>
                      <List.Item>{item.name}</List.Item>
                      <List.Item>{item.key}</List.Item>
                      
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
    fontWeight: 'bold',
   // paddingTop: 40,
    //paddingHorisontal: 20 
  },
  item:{
    marginTop: 5,
    padding: 24,
    marginBottom:10,
    fontSize: 20,
    width:400,
    backgroundColor: '#cdebf9'

  }
})
export default BankAccounts;
