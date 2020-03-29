import React from "react";
import { Router, Scene } from "react-native-router-flux";
import withLayout from "../components/Layout";

import TabScene from "../scenes/tabScene";
import UserProfile from "../scenes/userProfile";
import UserLogin from "../scenes/userLogin";
import UserRegistration from "../scenes/userRegistration";
import ForgotPassword from "../scenes/forgotPassword";

const Routes = () => {
  return (
    <Router>
      <Scene key="root">
        <Scene hideNavBar={true} key="userLogin" component={UserLogin} />
        <Scene
          hideNavBar={true}
          key="forgotPassword"
          component={withLayout(ForgotPassword)}
        />
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
