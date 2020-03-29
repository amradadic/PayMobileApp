import React from "react";
import { Tabs, Icon } from "@ant-design/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import QRScanner from "./components/qrScanner";
import Transactions from "./components/transactions";
import BankAccounts from "./components/bankAccounts";
import { Actions } from "react-native-router-flux";

export default TabScene = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { title: "Transakcije", icon: "dollar" },
    { title: "QR Scanner", icon: "qrcode" },
    { title: "Moji računi", icon: "credit-card" }
  ];

  
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        swipeable={true}
        tabs={tabs}
        page={selectedTab}
        onChange={(_, i) => {
          setSelectedTab(i)
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
                {tabProps.activeTab === i ? (
                  <Text
                    style={{
                      color: tabProps.activeTab === i ? "#597ef7" : "black"
                    }}
                  >
                    {tab.title}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      >
        <View style={styles.content}>
          <Transactions />
        </View>
        <View style={styles.content}>
          <QRScanner />
        </View>
        <View style={styles.content}>
          <BankAccounts />
        </View>
      </Tabs>
    </View>
  );
};
