import React, { useState, useEffect } from "react";
import { Router, Scene, Actions } from "react-native-router-flux";
import withLayout from "../components/Layout";
import { AppState } from "react-native";
import TabScene from "../scenes/tabScene";
import UserProfile from "../scenes/userProfile";
import UserLogin from "../scenes/userLogin";
import UserRegistration from "../scenes/userRegistration";
import ForgotPassword from "../scenes/forgotPassword";
import AddAccount from "../scenes/addAccount";
import { useAuthContext } from "../contexts/AuthContext";

const Routes = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const { logOut } = useAuthContext();
  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = nextAppState => {
    if (
      appState.match(/inactive|background/) &&
      Actions.currentScene !== "userRegistration" &&
      Actions.currentScene !== "userLogin" &&
      Actions.currentScene !== "forgotPassword"
    ) {
      logOut();
      Actions.reset("userLogin");
    }
    setAppState(nextAppState);
  };

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
          key="userRegistration"
          component={withLayout(UserRegistration)}
        />
      </Scene>
    </Router>
  );
};
export default Routes;
