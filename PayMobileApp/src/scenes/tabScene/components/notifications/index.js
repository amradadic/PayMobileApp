import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNotificationsContext } from "../../../../contexts/NotificationsContext";
import { useAuthContext } from "../../../../contexts/AuthContext";
import {
  Accordion,
  Icon,
  List,
  ActivityIndicator,
  Pagination,
  Button,
} from "@ant-design/react-native";
import styles from "./styles";
import axios from "axios";
import { BASE_URL } from "../../../../app/apiConfig";
import { Actions } from "react-native-router-flux";

const Notifications = ({ setUnreadNotificationsNum, selectedTab, setSelectedTab }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsFilter, setNotificationsFilter] = useState("all");
  const [currentUnreadNotification, setCurrentUnreadNotification] = useState(
    null
  );
  const {
    error,
    loading,
    notifications,
    getNotifications,
    setNotifications,
  } = useNotificationsContext();
  const { logOut, token } = useAuthContext();

  const [pageNum, setPageNum] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSections, setActiveSections] = useState([]);

  const renderList = () => {
    let items = [];
    for (
      let index = (currentPage - 1) * 10;
      index <
      (notifications[notificationsFilter].length < currentPage * 10
        ? notifications[notificationsFilter].length
        : currentPage * 10);
      index++
    ) {
      const notification = notifications[notificationsFilter][index];
      items.push(
        <Accordion.Panel
          key={index}
          header={
            <View style={styles.accordionPanelHeader}>
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
              <View style={styles.accordionPanelHeaderText}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: !notification.read ? "bold" : "normal",
                  }}
                >
                  {notification.notificationType.split("_").join(" ")}
                </Text>
                <Text>{notification.message}</Text>
              </View>
            </View>
          }
        >
          <List>
            <List.Item style={styles.listItem}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 17 }}>Date/Time:</Text>
                <Text style={{ fontSize: 17 }}>
                  {notification.notificationDateAndTime}
                </Text>
              </View>
            </List.Item>
            <List.Item style={styles.listItem}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 17 }}>Status:</Text>
                <Text style={{ fontSize: 17 }}>
                  {notification.notificationStatus}
                </Text>
              </View>
            </List.Item>
            <List.Item style={styles.listItem}>
            <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  justifyContent:"center"
                }}
              >
                <Button
                  style={styles.button}
                  activeStyle={{
                    ...styles.button,
                    backgroundColor: "white",
                    alignContent: "center",
                    
                  }}
            onPress={() => {
              console.log("radi");
              if (notification.notificationType === "MONEY_TRANSFER")
                Actions.push("fundsTransfers");
              else if (notification.notificationType === "TRANSACTION")
              setSelectedTab(0);
              else if (notification.notificationType === "ACCOUNT_BALANCE")
              setSelectedTab(3);
            }}
          >
           <Text style={{ color: "#061178" , textAlign: "center"}} >Advanced look</Text> 
          </Button>
                </View>
              </List.Item>
          </List>
        </Accordion.Panel>
      );
    }

    return items;
  };

  const readNotification = (value) => {
    if (
      currentUnreadNotification !== null &&
      (value.length === 0 ||
        (value.length > 0 &&
          notifications[notificationsFilter].length > 0 &&
          notifications[notificationsFilter][
            value[0] + (currentPage - 1) * 10
          ] !== currentUnreadNotification))
    ) {
      setNotifications((prevState) => {
        const index = prevState.unread.findIndex(
          (notification) =>
            currentUnreadNotification.notificationId ===
              notification.notificationId && notification.read
        );
        if (index > -1 && index < prevState.unread.length)
          prevState.unread.splice(index, 1);
        if (value.length > 0 && value[0] + (currentPage - 1) * 10 > index) {
          value = [value[0] - 1];
        }
        setUnreadNotificationsNum(prevState.unread.length);
        return prevState;
      });
      setCurrentUnreadNotification(null);
    }

    if (
      value.length > 0 &&
      notifications[notificationsFilter].length > 0 &&
      notifications[notificationsFilter][value[0] + (currentPage - 1) * 10]
        .read === false
    ) {
      readNotificationRequest(
        notifications[notificationsFilter][value[0] + (currentPage - 1) * 10]
          .notificationId
      );
      setNotifications((prevState) => {
        prevState["all"].find(
          (notification) =>
            notifications[notificationsFilter][
              value[0] + (currentPage - 1) * 10
            ].notificationId === notification.notificationId
        ).read = true;

        prevState["unread"].find(
          (notification) =>
            notifications[notificationsFilter][
              value[0] + (currentPage - 1) * 10
            ].notificationId === notification.notificationId
        ).read = true;
        return prevState;
      });
      setCurrentUnreadNotification(
        notifications[notificationsFilter][value[0] + (currentPage - 1) * 10]
      );
    }
    return value;
  };

  const readNotificationRequest = (notificationId) => {
    try {
      axios.get(`${BASE_URL}api/notifications/specific/${notificationId}`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });
    } catch (error) {
      if (error.message.includes("401")) {
        logOut();
        Actions.reset("userLogin");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setPageNum(
      parseInt(notifications[notificationsFilter].length / 10) +
        (notifications[notificationsFilter].length % 10 === 0 ? 0 : 1)
    );
  }, [notifications, notificationsFilter]);

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
                <Text
                  style={{
                    ...styles.optionsText,
                    fontWeight:
                      notificationsFilter === "unread" ? "bold" : "normal",
                  }}
                >
                  Unread
                </Text>
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
        <View style={styles.background}>
          <Accordion
            onChange={(value) => {
              value = readNotification(value);
              setActiveSections(value);
              setShowOptions(false);
            }}
            activeSections={activeSections}
            style={styles.background}
          >
            {renderList()}
          </Accordion>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              padding: 5,
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              disabled={loading || currentPage === 1}
              style={styles.paginationButton}
              onPress={() => {
                setActiveSections([]);
                setShowOptions(false);
                setCurrentPage((prevState) => prevState - 1);
              }}
            >
              <Icon
                name="left"
                color={loading || currentPage === 1 ? "#95A5A6" : "#061178"}
              />
            </TouchableOpacity>
            <Pagination
              total={pageNum}
              style={{ paddingHorizontal: 40 }}
              current={currentPage}
              mode="number"
            />
            <TouchableOpacity
              disabled={loading || currentPage === pageNum}
              style={styles.paginationButton}
              onPress={() => {
                setActiveSections([]);
                setShowOptions(false);
                setCurrentPage((prevState) => prevState + 1);
              }}
            >
              <Icon
                name="right"
                color={
                  loading || currentPage === pageNum ? "#95A5A6" : "#061178"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Notifications;
