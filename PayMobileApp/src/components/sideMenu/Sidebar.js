import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import { List, Icon } from "@ant-design/react-native";
import styles from "./styles";
import { useAuthContext } from "../../contexts/AuthContext";

const Sidebar = ({ setSelectedTab, setSideMenuOpen }) => {
  const { logOut } = useAuthContext();
  const onPressChangeTab = tab => {
    setSideMenuOpen(false);
    setSelectedTab(tab);
  };

  const goToPage = page => {
    setSideMenuOpen(false);
    Actions.push(page, { setSideMenuOpen });
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Main menu</Text>
      </View>
      <List>
        <List.Item style={styles.listItem}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPressChangeTab(1)}
          >
            <View style={styles.listView}>
              <Icon name="qrcode" color={"black"} />
              <Text style={styles.itemText}>QR Scanner</Text>
            </View>
          </TouchableOpacity>
        </List.Item>
        <List.Item style={styles.listItem}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPressChangeTab(0)}
          >
            <View style={styles.listView}>
              <Icon name="dollar" color={"black"} />
              <Text style={styles.itemText}>Transactions</Text>
            </View>
          </TouchableOpacity>
        </List.Item>
        <List.Item style={styles.listItem}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPressChangeTab(2)}
          >
            <View style={styles.listView}>
              <Icon name="credit-card" color={"black"} />
              <Text style={styles.itemText}>My accounts</Text>
            </View>
          </TouchableOpacity>
        </List.Item>
        <List.Item style={styles.listItem}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => goToPage("addAccount")}
          >
            <View style={styles.listView}>
              <Icon name="plus-circle" color={"black"} />
              <Text style={styles.itemText}>Add account</Text>
            </View>
          </TouchableOpacity>
        </List.Item>
        <List.Item style={styles.listItem}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => goToPage("userProfile")}
          >
            <View style={styles.listView}>
              <Icon name="lock" color={"black"} />
              <Text style={styles.itemText}>Change password</Text>
            </View>
          </TouchableOpacity>
        </List.Item>
      </List>
      <View
        style={{ ...styles.logout, ...styles.listItem, flexDirection: "row" }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ width: "100%", height: "100%" }}
          onPress={() => {
            logOut();
            Actions.reset("userLogin");
          }}
        >
          <View style={styles.listView}>
            <Icon name="logout" color={"black"} />
            <Text style={styles.itemText}>Log out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Sidebar;
