import React from "react";
import { registerRootComponent } from "expo";
import FontWrapper from "./FontWrapper";
import Layout from "../components/Layout";

const App = () => {
  return (
    <FontWrapper>
      <Layout />
    </FontWrapper>
  );
};

registerRootComponent(App);
