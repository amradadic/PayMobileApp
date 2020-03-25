import React, { useState } from "react";
import Navbar from "./navbar";
import TabBar from "./tabBar";
import { View } from "react-native";
import SideMenu from "./sideMenu";
import Constants from "expo-constants";

export default Layout = ({ children }) => {
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1);
  return (
    <>
      <View
        style={{
          height: Constants.statusBarHeight - 2,
          backgroundColor: "#030852"
        }}
      ></View>
      <SideMenu
        isSideMenuOpen={isSideMenuOpen}
        setSideMenuOpen={setSideMenuOpen}
        setSelectedTab={setSelectedTab}
      >
        <Navbar setSideMenuOpen={setSideMenuOpen} />
        <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </SideMenu>
    </>
  );
};
