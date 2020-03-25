import React from "react";
import { Tabs, Icon } from "@ant-design/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

export default TabBar = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { title: "Transakcije", icon: "unordered-list" },
    { title: "QR Scanner", icon: "qrcode" },
    { title: "Moji računi", icon: "credit-card" }
  ];

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        swipeable={true}
        tabs={tabs}
        page={selectedTab}
        onTabClick={(_, i) => {
          setSelectedTab(i);
        }}
        tabBarPosition="bottom"
        renderUnderline={true}
        renderTabBar={tabProps => (
          <View style={styles.tabBar}>
            {tabProps.tabs.map((tab, i) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={tab.key || i}
                style={styles.tabTouch}
                onPress={() => {
                  const { goToTab, onTabClick } = tabProps;
                  onTabClick && onTabClick(tabs[i], i);
                  goToTab && goToTab(i);
                }}
              >
                <Icon
                  style={{
                    color: tabProps.activeTab === i ? "#597ef7" : "black"
                  }}
                  name={tab.icon}
                  size="md"
                />
                <Text
                  style={{
                    color: tabProps.activeTab === i ? "#597ef7" : "black"
                  }}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      >
        <View style={styles.content}>
          {/*Ovdje ide komponenta transakcija umjesto teksta */}
          <Text>Lista transakcija</Text>
        </View>
        <View style={styles.content}>
          {/*Ovdje ide komponenta QR scanner umjesto teksta */}
          <Text>Qr Scanner</Text>
        </View>
        <View style={styles.content}>
          {/*Ovdje ide komponenta liste računa umjesto teksta */}
          <Text>Lista računa</Text>
        </View>
      </Tabs>
    </View>
  );
};
