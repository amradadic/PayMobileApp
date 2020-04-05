import React, { useState, useEffect } from "react";
import { Tabs, Icon } from "@ant-design/react-native";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
} from "react-native";
import styles from "./styles";
import QRScanner from "./components/qrScanner";
import Transactions from "./components/transactions";
import BankAccounts from "./components/bankAccounts";
import ExitModal from "./components/exitModal";
import { Actions } from "react-native-router-flux";

const TabScene = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { title: "Transactions", icon: "dollar" },
    { title: "QR Scanner", icon: "qrcode" },
    { title: "My accounts", icon: "credit-card" },
  ];
  const [exitModalVisible, setExitModalVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios")
      BackHandler.addEventListener("hardwareBackPress", () => {
        if (Actions.currentScene === "tabScene") setExitModalVisible(true);
      });
    return () => {
      if (Platform.OS !== "ios")
        BackHandler.removeEventListener("hardwareBackPress", () => {
          if (Actions.currentScene === "tabScene") setExitModalVisible(true);
        });
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ExitModal
        isVisible={exitModalVisible}
        setVisible={setExitModalVisible}
        message={"You are logging out of the app. Do you want to proceed"}
      />
      <Tabs
        swipeable={true}
        tabs={tabs}
        page={selectedTab}
        onChange={(_, i) => {
          setSelectedTab(i);
        }}
        tabBarPosition="bottom"
        renderTabBar={(tabProps) => (
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
                  color={tabProps.activeTab === i ? "#597ef7" : "black"}
                  name={tab.icon}
                  size="md"
                />
                {tabProps.activeTab === i ? (
                  <Text
                    style={{
                      color: tabProps.activeTab === i ? "#597ef7" : "black",
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
        <View>
          <QRScanner />
        </View>
        <View>
          <BankAccounts />
        </View>
      </Tabs>
    </View>
  );
};

export default TabScene;
