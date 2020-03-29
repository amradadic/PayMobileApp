import React from "react";
import { registerRootComponent } from "expo";
import FontWrapper from "./FontWrapper";
import Routes from "./Routes";
import { Provider as AuthContextProvider } from "../contexts/AuthContext";

const App = () => {
  return (
    <FontWrapper>
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </FontWrapper>
  );
};

registerRootComponent(App);
