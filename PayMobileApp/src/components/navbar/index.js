import React, { useState, useEffect } from "react";
import { Icon } from "@ant-design/react-native";
import { View, TouchableOpacity, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import styles from "./styles";
import { useAuthContext } from "../../contexts/AuthContext";

export default Navbar = ({ setSideMenuOpen }) => {
  const { isAuth } = useAuthContext();

  const [backIcon, setBackIcon] = useState(false);
  const [burgerIcon, setBurgerIcon] = useState(true);
  const [prevScene, setPrevScene] = useState("tabScene");

  useEffect(() => {
    if (Actions.currentScene !== prevScene) {
      setBackIcon(Actions.currentScene === "userProfile" || Actions.currentScene === "userRegistration");
      setBurgerIcon(Actions.currentScene !== "userProfile" && Actions.currentScene !== "userRegistration")
      setPrevScene(Actions.currentScene);
    }
  }, [Actions.currentScene]);

  return (
    <View style={styles.nav}>
      {backIcon ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (isAuth()) Actions.pop();
            else Actions.reset("userLogin");
          }}
          style={{padding: 5}}
        >
          <Icon name="arrow-left" />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.logo}>
        Pay<Text style={{ color: "#85a5ff" }}>App</Text>
      </Text>

      {burgerIcon ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setSideMenuOpen(true);
          }}
        >
          <Icon name="menu" style={styles.burger} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
