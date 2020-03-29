import React, { useState } from "react";
import { Router, Scene, Actions } from "react-native-router-flux";
import { useAuthContext } from "../contexts/AuthContext";
import withLayout from "../components/Layout";

import TabScene from "../scenes/tabScene";
import UserProfile from "../scenes/userProfile";
import UserLogin from "../scenes/userLogin";
import UserRegistration from "../scenes/userRegistration";

const Routes = () => {
  const { isAuth } = useAuthContext();
  if (!isAuth()) Actions.reset("userLogin")
    return (
      <Router>
        <Scene key="root">
          <Scene hideNavBar={true} key="userLogin" component={UserLogin} />
          <Scene
            key="tabScene"
            component={withLayout(TabScene)}
            hideNavBar={true}
          />
          <Scene
            hideNavBar={true}
            key="userProfile"
            component={withLayout(UserProfile)}
          />

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
