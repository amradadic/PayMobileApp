import React from "react";
import { Provider } from "@ant-design/react-native";
import { Provider as AuthContextProvider } from "./AuthContext";
import { Provider as NotificationsContextProvider } from "./NotificationsContext";
import enUS from "@ant-design/react-native/es/locale-provider/en_US";

const ContextProvider = ({ children }) => {
  return (
    <Provider locale={enUS}>
      <AuthContextProvider>
        <NotificationsContextProvider>{children}</NotificationsContextProvider>
      </AuthContextProvider>
    </Provider>
  );
};

export default ContextProvider;
