import React from "react";
import { Drawer } from "@ant-design/react-native";
import Sidebar from "./Sidebar";

const SideMenu = ({
  setSelectedTab,
  setSideMenuOpen,
  isSideMenuOpen,
  children
}) => {
  return (
    <Drawer
      sidebar={
        <Sidebar
          setSelectedTab={setSelectedTab}
          setSideMenuOpen={setSideMenuOpen}
        />
      }
      position="right"
      drawerWidth={240}
      open={isSideMenuOpen}
      drawerRef={el => (drawer = el)}
      onOpenChange={isOpen => setSideMenuOpen(isOpen)}
      drawerBackgroundColor="#fff"
    >
      {children}
    </Drawer>
  );
};

export default SideMenu;