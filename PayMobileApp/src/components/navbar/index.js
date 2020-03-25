import React, { useState, useEffect } from "react";
import { Icon } from "@ant-design/react-native";
import { View, TouchableOpacity, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import styles from "./styles";

export default Navbar = ({ setSideMenuOpen }) => {
  const [renderIcons, setRenderIcons] = useState(false);
  const [prevScene, setPrevScene] = useState("tabScene");

  useEffect(() => {
    if (Actions.currentScene !== prevScene) {
      setRenderIcons(Actions.currentScene === "userProfile");
      setPrevScene(Actions.currentScene);
    }
  }, [Actions.currentScene]);

  return (
    <View style={styles.nav}>
      {renderIcons ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Actions.popTo("tabScene");
          }}
        >
          <Icon name="arrow-left" />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.logo}>
        Pay<Text style={{ color: "#85a5ff" }}>App</Text>
      </Text>

      {!renderIcons ? (
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
