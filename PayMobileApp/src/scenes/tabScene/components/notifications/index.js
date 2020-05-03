import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNotificationsContext } from "../../../../contexts/NotificationsContext";
import { Icon, List, ActivityIndicator } from "@ant-design/react-native";
import styles from "./styles";

const Notifications = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsFilter, setNotificationsFilter] = useState("all");
  const {
    error,
    loading,
    notifications,
    getNotifications,
    readNotification,
  } = useNotificationsContext();
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getNotifications();
            setRefreshing(false);
          }}
        />
      }
    >
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowOptions((prevState) => !prevState)}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            <Icon name={showOptions ? "up" : "down"} color="#061178" />
          </View>
        </TouchableOpacity>
        {showOptions ? (
          <>
            <View style={styles.options}>
              <TouchableOpacity
                disabled={loading}
                style={styles.optionsButton}
                onPress={() => setNotificationsFilter("all")}
              >
                <Text
                  style={{
                    ...styles.optionsText,
                    fontWeight:
                      notificationsFilter === "all" ? "bold" : "normal",
                  }}
                >
                  All
                </Text>
                {/* <Icon name="bell" color="#061178" /> */}
              </TouchableOpacity>
              <TouchableOpacity
                disabled={loading}
                style={styles.optionsButton}
                onPress={() => setNotificationsFilter("unread")}
              >
                <Text style={{
                    ...styles.optionsText,
                    fontWeight:
                      notificationsFilter === "unread" ? "bold" : "normal",
                  }}>Unread</Text>
                {/* <Icon name="bell" theme="filled" color="#061178" /> */}
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            paddingTop: 60,
          }}
        >
          <ActivityIndicator size="large" color="#061178" />
        </View>
      ) : error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", padding: 30 }}>
            {console.log(error)}
            Error has occured while loading. Please refresh and try again!
          </Text>
        </View>
      ) : !notifications || notifications[notificationsFilter].length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            paddingTop: 80,
            width: "100%",
          }}
        >
          <Text style={{ paddingTop: 10, fontSize: 20, textAlign: "center" }}>
            {notificationsFilter === "all"
              ? "You don't have any notifications"
              : "You don't have any unread notifications"}
          </Text>
        </View>
      ) : (
        <List>
          {notifications[notificationsFilter].map((notification, index) => (
            <List.Item
              key={index}
              thumb={
                <Icon
                  name={
                    notification.notificationStatus === "INFO"
                      ? "info-circle"
                      : notification.notificationStatus === "WARNING"
                      ? "exclamation-circle"
                      : "close-circle"
                  }
                  color={
                    notification.notificationStatus === "INFO"
                      ? "#52c41a"
                      : notification.notificationStatus === "WARNING"
                      ? "#faad14"
                      : "#f5222d"
                  }
                  style={{ paddingRight: 10 }}
                />
              }

              onPress = {async () => {
                await readNotification(notification);
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: !notification.read ? "bold" : "normal",
                }}
              >
                {notification.notificationType.split("_").join(" ")}
              </Text>
              <List.Item.Brief>{`${notification.message}
                                  ${notification.notificationId}
                                  ${notification.notificationDateAndTime}`}</List.Item.Brief>
            </List.Item>
          ))}
        </List>
      )}
    </ScrollView>
  );
};

export default Notifications;
