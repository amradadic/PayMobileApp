import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import { BASE_URL } from "../app/apiConfig";
import { Vibration, Platform } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { Toast } from "@ant-design/react-native";
import { useAuthContext } from "./AuthContext";

export const Context = createContext();

export const Provider = (props) => {
  const { children } = props;
  const { token } = useAuthContext();
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notifications, setNotifications] = useState({ unread: [], all: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastNotificationId, setLastNotificationId] = useState(null);

  const subscribeToServer = async (stompContext, StompEventTypes) => {
    const client = await stompContext.newStompClient(`${BASE_URL}websocket`);
    stompContext.addStompEventListener(StompEventTypes.Connect, async () => {
      console.log("Connected");
      const { data } = await axios.get(`${BASE_URL}api/auth/user/me`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });
      stompContext
        .getStompClient()
        .subscribe(`/queue/reply/${data.username}`, (msg) => {
          if(lastNotificationId !== JSON.parse(msg.body).notificationId){ 
            setLastNotificationId(JSON.parse(msg.body).notificationId)
            handleNotification(JSON.parse(msg.body));
          }
          
        });
    });

    stompContext.addStompEventListener(StompEventTypes.Disconnect, () => {
      console.log("Disconnected");
    });

    stompContext.addStompEventListener(StompEventTypes.WebSocketClose, () => {
      console.log("Disconnected (not graceful)");
    });
  };

  const registerForNotifications = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Toast.fail("Failed to get push token for push notification!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      setExpoPushToken(token);
    } else {
      Toast.fail("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  const sendPushNotification = async (notification) => {
    if (notification.hasOwnProperty("message")) return;
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Notification",
      body: notification
        ? notification.notificationType.split("_").join(" ")
        : "",
      data: notification ? notification : {},
      _displayInForeground: true,
    };
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  const notifyTheWaiter = async () => {
    if (
      typeof notifications === "undefined" ||
      notifications === null ||
      notifications.all.length === 0
    )
      return;
  };

  const getNotifications = async () => {
    try {
      setError(null);
      setLoading(true);
      const unreadResponse = await axios.get(
        `${BASE_URL}api/notifications/unread`,
        {
          headers: {
            authorization: `${token.tokenType} ${token.accessToken}`,
          },
        }
      );
      const allResponse = await axios.get(`${BASE_URL}api/notifications/all`, {
        headers: {
          authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });
      setNotifications({
        unread: [...unreadResponse.data].reverse(),
        all: [...allResponse.data].reverse(),
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotification = (data) => {
    if (
      data.hasOwnProperty("message") &&
      data.hasOwnProperty("notificationType") &&
      data.hasOwnProperty("notificationDateAndTime") &&
      data.hasOwnProperty("notificationId") &&
      data.hasOwnProperty("read") &&
      data.hasOwnProperty("subjectId")
    ) {
      console.log("*************", data);
      Vibration.vibrate();
      setNotifications((prevState) => ({
        unread: !data.read
          ? [data, ...prevState.unread]
          : [...prevState.unread],
        all: [data, ...prevState.all],
      }));
    }
  };

  const notificationsContext = {
    notifyTheWaiter,
    subscribeToServer,
    sendPushNotification,
    registerForNotifications,
    handleNotification,
    getNotifications,
    setNotifications,
    notifications,
    loading,
    error,
  };

  return (
    <Context.Provider value={notificationsContext}>{children}</Context.Provider>
  );
};

export const { Consumer } = Context;

export const useNotificationsContext = () => useContext(Context);
