import React from 'react';
import styles from './styles';
import Constants from "expo-constants";
import { List, InputItem, Icon, Button } from "@ant-design/react-native";
import { View, Alert, KeyboardAvoidingView, Platform, Text, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const ForgotPassword = () => {
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
              <Button  style={styles.button} onPress = {()=>{
                  Alert.alert(
                      "Password successfully recovered",
                      "You will be prompted back to the log in page.",
                      [
                          {text:"Close", style: "cancel" ,onPress: Actions.replace("userLogin")}
                      ]
                  );
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
