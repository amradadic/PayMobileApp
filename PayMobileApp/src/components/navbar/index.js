import React from "react";
import { Icon } from "@ant-design/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

export default Navbar = ({ setSideMenuOpen }) => {
  return (
    <View style={styles.nav}>
      <Text style={styles.logo}>PayApp</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setSideMenuOpen(true);
        }}
      >
        <Icon name="menu" style={styles.burger} />
      </TouchableOpacity>
    </View>
  );
};
