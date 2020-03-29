import React from "react";
import { registerRootComponent } from "expo";
import FontWrapper from "./FontWrapper";
import Routes from "./Routes";
import { Provider } from "@ant-design/react-native";
import { Provider as AuthContextProvider } from "../contexts/AuthContext";

const App = () => {
  return (
    <Provider>
      <FontWrapper>
        <AuthContextProvider>
          <Routes />
        </AuthContextProvider>
      </FontWrapper>
    </Provider>

  );
};

registerRootComponent(App);
