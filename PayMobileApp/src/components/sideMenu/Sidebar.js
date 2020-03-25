import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import { List, Icon } from "@ant-design/react-native";
import styles from "./styles";

const Sidebar = ({ setSelectedTab, setSideMenuOpen }) => {
  const onPressChangeTab = tab => {
    setSideMenuOpen(false);
    setTimeout(() => setSelectedTab(tab), 235);
  };

  const goToUserProfile = () => {
    setSideMenuOpen(false);
    Actions.push("userProfile", { setSideMenuOpen });
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Glavni meni</Text>
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
              <Text style={styles.itemText}>Transakcije</Text>
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
              <Text style={styles.itemText}>Moji računi</Text>
            </View>
          </TouchableOpacity>
        </List.Item>
        <List.Item style={styles.listItem}>
          <TouchableOpacity activeOpacity={0.5} onPress={goToUserProfile}>
            <View style={styles.listView}>
              <Icon name="user" color={"black"} />
              <Text style={styles.itemText}>Profil</Text>
            </View>
          </TouchableOpacity>
        </List.Item>
      </List>
      <View
        style={{ ...styles.logout, ...styles.listItem, flexDirection: "row" }}
      >
        <View style={styles.listView}>
          <Icon name="logout" color={"black"} />
          <Text style={styles.itemText}>Izlaz</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Sidebar;
