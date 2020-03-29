import React, { useState } from "react";
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
import { List, InputItem, Icon, Button, Toast } from "@ant-design/react-native";
import { useAuthContext } from "../../contexts/AuthContext";
import Biometrics from "./components/Biometrics";

const UserLogin = () => {
  const { logIn, error, loading } = useAuthContext();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLoginPressed = () => {
    logIn();
    Actions.replace("tabScene");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.body}>
        <Background />

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
              onChange={value => setUsernameOrEmail(value)}
            />
          </List>

          <List style={{ ...styles.list, marginBottom: 11 }}>
            <InputItem
              style={styles.listItem}
              placeholder="Password"
              extra={<Icon name="lock" />}
              type="password"
              onChange={value => setPassword(value)}
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
              <Text
                style={{ color: loading ? "#95A5A6" : "white", fontSize: 16 }}
              >
                Click here!
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            activeStyle={{ backgroundColor: "#030852" }}
            style={styles.loginButton}
            type="primary"
<<<<<<< HEAD
            onPress={() => {
              onLoginPressed();
=======
            loading={loading}
            disabled={loading}
            onPress={async () => {
              const success = await logIn(usernameOrEmail, password);
              if (!success) Toast.fail("Incorrect credentials", 0.8);
              else Actions.replace("tabScene");
>>>>>>> origin/Dzan-login
            }}
          >
            LOG IN
          </Button>
          <Biometrics logIn={onLoginPressed} />
          <TouchableOpacity
            disabled={loading}
            style={{
              ...styles.signUpButton,
              borderColor: loading ? "#95A5A6" : "#061178"
            }}
            onPress={() => {
              Actions.push("userRegistration");
            }}
          >
            <Text
              style={{
                ...styles.signUpButtonText,
                color: loading ? "#95A5A6" : "#061178"
              }}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserLogin;
