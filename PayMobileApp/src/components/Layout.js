import React, { useState } from "react";
import Navbar from "./navbar";
import SideMenu from "./sideMenu";

import { View } from "react-native";
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
          <Navbar setSideMenuOpen={setSideMenuOpen} />
          <Component {...props} />
        </SideMenu>
      </>
    );
  };
};
