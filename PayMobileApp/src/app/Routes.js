import React from "react";
import { Router, Scene } from "react-native-router-flux";
import withLayout from "../components/Layout";
import AddAccount from "../scenes/addAccount";
import ForgotPassword from "../scenes/forgotPassword";
import TabScene from "../scenes/tabScene";
import UserLogin from "../scenes/userLogin";
import UserProfile from "../scenes/userProfile";
import UserRegistration from "../scenes/userRegistration";
import Transfers from "../scenes/transfer";
import AccountPreferences from "../scenes/accountPreferences";

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
          hideNavBar={true}
          key="addAccount"
          component={withLayout(AddAccount)}
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
          key="fundsTransfers"
          component={withLayout(Transfers)}
        />
        <Scene
          hideNavBar={true}
          key="accountPreferences"
          component={withLayout(AccountPreferences)}
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
