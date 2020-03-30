import React from "react";
import { registerRootComponent } from "expo";
import FontWrapper from "./FontWrapper";
import Routes from "./Routes";
import { Provider } from "@ant-design/react-native";
import { Provider as AuthContextProvider } from "../contexts/AuthContext";
import enUS from "@ant-design/react-native/es/locale-provider/en_US";

const App = () => {
  return (
    <Provider locale={enUS}>
      <FontWrapper>
        <AuthContextProvider>
          <Routes />
        </AuthContextProvider>
      </FontWrapper>
    </Provider>
  );
};

registerRootComponent(App);
