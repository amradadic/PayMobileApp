import React, { useState, useContext, createContext, useEffect } from "react";
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
      token = await Notifications.getExpoPushTokenAsync();
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
        unread: [...unreadResponse.data],
        all: [...allResponse.data],
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotification = (notification) => {
    Vibration.vibrate();
    setNotifications((prevState) => ({
      unread: [notification, ...prevState.unread],
      all: [notification, ...prevState.all],
    }));
  };

  useEffect(() => {
      Notifications.addListener(handleNotification);
  }, [])

  const notificationsContext = {
    registerForNotifications,
    handleNotification,
    getNotifications,
    setNotifications,
    notifications,
    loading,
    error
  };

  return (
    <Context.Provider value={notificationsContext}>{children}</Context.Provider>
  );
};

export const { Consumer } = Context;

export const useNotificationsContext = () => useContext(Context);
