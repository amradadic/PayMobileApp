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
import { getLatestUser } from "../../helperFunctions";

const UserLogin = () => {
  const { logIn, error, loading } = useAuthContext();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (usernameOrEmail, password) => {
    const success = await logIn(usernameOrEmail, password);
    if (!success) Toast.fail("Incorrect credentials", 0.8);
    else Actions.replace("tabScene");
  };

  const onLoginPressed = async () => {
    const { username, password } = await getLatestUser();
    await login(username, password);
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
            <TouchableOpacity style={{ padding: 5 }} onPress={()=>{Actions.push("forgotPassword")}}>
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
            loading={loading}
            disabled={loading}
            onPress={async () => {
              await login(usernameOrEmail, password);
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
