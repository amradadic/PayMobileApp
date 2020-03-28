import React, { useState } from "react";
import { Router, Scene } from "react-native-router-flux";
import withLayout from "../components/Layout";

import TabScene from "../scenes/tabScene";
import UserProfile from "../scenes/userProfile";
import UserLogin from "../scenes/userLogin";
import UserRegistration from "../scenes/userRegistration";

const Routes = () => {
  const [selectedTab, setSelectedTab] = useState(1);

  return (
    <Router>
      <Scene key="root">
        {/* <Scene
          key="tabScene"
          component={withLayout(TabScene)}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          hideNavBar={true}
        />
        <Scene
          hideNavBar={true}
          key="userProfile"
          component={withLayout(UserProfile)}
        />
        <Scene hideNavBar={true} key="userLogin" component={UserLogin} /> */}
        <Scene
          hideNavBar={true}
          key="userRegistration"
          component={withLayout(UserRegistration)}
        />
      </Scene>
    </Router>
  );
};
export default Routes;
