import React from "react";
import { registerRootComponent } from "expo";
import FontWrapper from "./FontWrapper";
import Routes from "./Routes";
import { Provider } from "@ant-design/react-native";

const App = () => {
  return (
    <Provider>
      <FontWrapper>
        <Routes />
      </FontWrapper>
    </Provider>
  );
};

registerRootComponent(App);
