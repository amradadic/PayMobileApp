import React, { useState } from "react";
import Navbar from "./navbar";
import SideMenu from "./sideMenu";

import { View, KeyboardAvoidingView, Platform } from "react-native";
import Constants from "expo-constants";

export default withLayout = Component => {
  return ({ ...props }) => {
    const [isSideMenuOpen, setSideMenuOpen] = useState(false);
    return (
      <>
        <View
          style={{
            height: Constants.statusBarHeight - 2,
            backgroundColor: "#030852"
          }}
        />
        <SideMenu
          isSideMenuOpen={isSideMenuOpen}
          setSideMenuOpen={setSideMenuOpen}
          {...props}
        >
          <KeyboardAvoidingView
            behavior={Platform.Os == "ios" ? "padding" : "height"}
            style={{flex: 1}}
          >
            <Navbar setSideMenuOpen={setSideMenuOpen} />
            <Component {...props} />
          </KeyboardAvoidingView>
        </SideMenu>
      </>
    );
  };
};
