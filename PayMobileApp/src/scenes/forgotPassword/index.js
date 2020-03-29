import React, { useState } from 'react';
import styles from './styles';
import Constants from "expo-constants";
import { List, InputItem, Icon, Button } from "@ant-design/react-native";
import { View, Alert, KeyboardAvoidingView, Platform, Text, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import HelpModal from '../userRegistration/components/helpModal';

const ForgotPassword = () => {

    const [isPressed, setIsPressed] = useState(false);

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
              <InputItem style={styles.input} placeholder="Username or Email" extra={<Icon name="user" />}/>
          </View>

          <Text style={styles.prompText}>Answer your security question.</Text>
          <View style={styles.inputArea}>
              <InputItem style={styles.input} placeholder="Answer" extra={<Icon name="lock" />}/>
          </View>

          <View>
              <Button  style={styles.button} onPress = {()=>  {
                  <HelpModal setVisible = {setIsPressed} isVisible = {isPressed} message={"BRAVO"}/>
              }}>
                  <Text style={styles.buttonText}>RECOVER</Text>
              </Button>
          </View>

          </View>

          </ScrollView>

    </KeyboardAvoidingView>

    );
}

export default ForgotPassword;
