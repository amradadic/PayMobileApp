import React from "react";
import { registerRootComponent } from "expo";
import FontWrapper from "./FontWrapper";
import Routes from "./Routes";

const App = () => {
  return (
    <FontWrapper>
      <Routes />
    </FontWrapper>
  );
};

registerRootComponent(App);
