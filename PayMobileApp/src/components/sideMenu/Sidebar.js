import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { List, Icon } from "@ant-design/react-native";
import styles from "./styles";

export default Sidebar = ({ setSelectedTab, setSideMenuOpen }) => {
  const onPressChangeTab = tab => {
    setSelectedTab(tab);
    setSideMenuOpen(false);
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
              <Icon name="unordered-list" color={"black"} />
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
          <View style={styles.listView}>
            <Icon name="user" color={"black"} />
            <Text style={styles.itemText}>Profil</Text>
          </View>
        </List.Item>
      </List>
      <View
        style={{ ...styles.logout, ...styles.listItem, flexDirection: "row" }}
      >
        <View style={styles.listView}>
          <Icon name="logout" color={"black"} />
          <Text style={styles.itemText}>Odjava</Text>
        </View>
      </View>
    </ScrollView>
  );
};
