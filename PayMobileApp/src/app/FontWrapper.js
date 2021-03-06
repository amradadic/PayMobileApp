import React, { useState, useEffect } from "react";
import { AppLoading } from "expo";
import * as Font from "expo-font";

const FontWrapper = ({ children }) => {
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync(
        "antoutline",
        require("@ant-design/icons-react-native/fonts/antoutline.ttf")
      );

      await Font.loadAsync(
        "sans-serif",
        require("../../assets/OpenSans-Regular.ttf")
      );

      await Font.loadAsync(
        "antfill",
        require("@ant-design/icons-react-native/fonts/antfill.ttf")
      );
      setReady(true);
    };
    loadFont();
  }, []);
  return !isReady ? <AppLoading /> : children;
};

export default FontWrapper;