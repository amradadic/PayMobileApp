import React, { useState } from 'react';
import styles from './styles';
import Constants from "expo-constants";
import {List, InputItem, Icon, Button } from "@ant-design/react-native";
import { View, KeyboardAvoidingView, Platform, Text, ScrollView, Alert } from 'react-native';
import { Actions } from "react-native-router-flux";

const ForgotPassword = () => {

    const [isValid, setValid] = useState(false);
    const [enteredUser, setEnteredUser] = useState('');
    const [enteredAnswer, setEnteredAnswer] = useState('');

    const logInReturn = () => {
        Actions.replace("userLogin");
    }

    const inputHandlerUser = text => {
        setEnteredUser(text);
    };

    const inputHandlerAnswer = text => {
        setEnteredAnswer(text);
    };

    const confirmButton = () => {
        const userName = enteredUser;
        const answer = enteredAnswer;
        if (userName == '' || answer == '' || userName === 'bakir') {
            Alert.alert('Invalid entry', 'There is no password available for this entry.', [{text: 'Close', style: 'destructive'}]);
            setValid(false);
            setEnteredUser('');
            setEnteredAnswer('');
            return;
        }
        else {
            Alert.alert('Success', 'Your password was successfully recovered.', [{text: 'Log in', style: 'destructive', onPress: logInReturn}]);

        }
    };

    return(
        <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      >
          <ScrollView style={styles.body}>

          <View style={styles.header}>
              <Text style={styles.title}>Forgot your password?</Text>
          </View>

<View style={styles.subsection}>
<Text style={styles.prompText}>Please enter your username or email.</Text>
          <View style={styles.inputArea}>
              <InputItem onChangeText={inputHandlerUser} value={enteredUser} style={styles.input} placeholder="Username or Email" extra={<Icon name="user" />}/>
          </View>

          <Text style={styles.prompText}>Answer your security question.</Text>
          <View style={styles.inputArea}>
              <InputItem onChangeText={inputHandlerAnswer} value={enteredAnswer} style={styles.input} placeholder="Answer" extra={<Icon name="lock" />}/>
          </View>

          <View>
              <Button  style={styles.button} onPress = {confirmButton}>
                  <Text style={styles.buttonText}>RECOVER</Text>
              </Button>
          </View>

          </View>

          </ScrollView>

    </KeyboardAvoidingView>

    );
}

export default ForgotPassword;
