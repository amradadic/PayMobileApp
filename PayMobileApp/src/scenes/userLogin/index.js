import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Actions } from "react-native-router-flux";
import Background from "./background";
import styles from "./styles";
import Constants from "expo-constants";
import { List, InputItem, Icon, Button } from "@ant-design/react-native";
import { useAuthContext } from "../../contexts/AuthContext";

const UserLogin = () => {
  const { logIn } = useAuthContext();

  return (
    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.body}>
        <Background />

        <View
          style={{
            position: "absolute",
            top: Constants.statusBarHeight,
            right: 0
          }}
        >
          <TouchableOpacity
            style={{ paddingHorizontal: 25, paddingVertical: 15 }}
          >
            <Icon size="lg" name="camera" color="white" />
          </TouchableOpacity>
        </View>
        <Image
          source={require("../../../assets/loginLogo.png")}
          style={styles.image}
        />
        <View style={styles.inputs}>
          <List style={styles.list}>
            <InputItem
              style={styles.listItem}
              placeholder="Username or Email"
              extra={<Icon name="user" />}
            />
          </List>

          <List style={{ ...styles.list, marginBottom: 11 }}>
            <InputItem
              style={styles.listItem}
              placeholder="Password"
              extra={<Icon name="lock" />}
            />
          </List>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingBottom: 40,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
            <TouchableOpacity style={{ padding: 5 }}>
              <Text style={{ color: "white", fontSize: 16 }}>Click here!</Text>
            </TouchableOpacity>
          </View>

          <Button
            activeStyle={{ backgroundColor: "#030852" }}
            style={styles.loginButton}
            type="primary"
            onPress={() => {
              logIn();
              Actions.replace("tabScene");
            }}
          >
            LOG IN
          </Button>
          <TouchableOpacity
            style={{ ...styles.signUpButton }}
            onPress={() => {
              Actions.push("userRegistration");
            }}
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserLogin;
