import React from "react";
import { Text } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export default AuthFailed = props => {
  const { error, authenticated } = props;
  LocalAuthentication.cancelAuthenticate();
  return (
    <React.Fragment>
      <Text style={{ color: "red", fontSize: 14 }}>
        {error || authenticated || `Failed to authenticate, please try again`}
      </Text>
    </React.Fragment>
  );
};
