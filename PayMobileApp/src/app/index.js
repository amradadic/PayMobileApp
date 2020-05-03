import React from "react";
import { registerRootComponent } from "expo";
import FontWrapper from "./FontWrapper";
import Routes from "./Routes";
import ContextProvider from "../contexts/";

const App = () => {
  return (
    <ContextProvider>
      <FontWrapper>
        <Routes />
      </FontWrapper>
    </ContextProvider>
  );
};

registerRootComponent(App);
