import React, { useState, useEffect } from "react";
import { Tabs, Icon, Badge } from "@ant-design/react-native";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform
} from "react-native";
import styles from "./styles";
import QRScanner from "./components/qrScanner";
import Transactions from "./components/transactions";
import BankAccounts from "./components/bankAccounts";
import ExitModal from "./components/exitModal";
import { Actions } from "react-native-router-flux";
import Notifications from "./components/notifications";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { StompEventTypes, withStomp } from "react-stompjs";

const TabScene = ({ selectedTab, setSelectedTab, stompContext }) => {
  const {
    getNotifications,
    notifications,
    subscribeToServer
  } = useNotificationsContext();
  const tabs = [
    { title: "Transactions", icon: "dollar" },
    { title: "QR Scanner", icon: "qrcode" },
    { title: "Notifications", icon: "bell" },
    { title: "My accounts", icon: "credit-card" }
  ];
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [unreadNotificationsNum, setUnreadNotificationsNum] = useState(notifications.unread.length);

  useEffect(() => {
    subscribeToServer(stompContext, StompEventTypes);
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

  useEffect(() => {
    if (Actions.currentScene === "tabScene") getNotifications();
  }, [Actions.currentScene]);

  useEffect(() => {
    setUnreadNotificationsNum(notifications.unread.length)
  }, [notifications.unread]);

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
            {console.log(unreadNotificationsNum)}
            {tabProps.tabs.map((tab, i) =>
              i === 2 ? (
                <Badge text={unreadNotificationsNum} key={tab.key || i}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.tabTouch}
                    onPress={() => {
                      const { goToTab, onTabClick } = tabProps;
                      onTabClick && onTabClick(tabs[i], i);
                      goToTab && goToTab(i);
                      setSelectedTab(i);
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
                          color: tabProps.activeTab === i ? "#597ef7" : "black"
                        }}
                      >
                        {tab.title}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                </Badge>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={tab.key || i}
                  style={styles.tabTouch}
                  onPress={() => {
                    const { goToTab, onTabClick } = tabProps;
                    onTabClick && onTabClick(tabs[i], i);
                    goToTab && goToTab(i);
                    setSelectedTab(i);
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
                        color: tabProps.activeTab === i ? "#597ef7" : "black"
                      }}
                    >
                      {tab.title}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              )
            )}
          </View>
        )}
      >
        <View>
          <Transactions />
        </View>
        <View>
          <QRScanner selectedTab={selectedTab} />
        </View>
        <View>
          <Notifications 
          setUnreadNotificationsNum={setUnreadNotificationsNum}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          />
        </View>
        <View>
          <BankAccounts />
        </View>
      </Tabs>
    </View>
  );
};

export default withStomp(TabScene);
