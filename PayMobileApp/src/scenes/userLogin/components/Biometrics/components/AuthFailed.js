import React from "react";
import { Text } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import styles from "./styles";

const AuthFailed = props => {
  const { error, authenticated } = props;
  LocalAuthentication.cancelAuthenticate();
  return (
    <React.Fragment>
      <Text style={styles.text}>
        {error || authenticated || `Failed to authenticate, please try again`}
      </Text>
    </React.Fragment>
  );
};
export default AuthFailed;
