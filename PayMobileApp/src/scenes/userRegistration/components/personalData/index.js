import React from "react";
import styles from "./styles";
import { Text, View } from "react-native";
import { List, InputItem, Toast, Icon } from "@ant-design/react-native";
import { validateRequired, validateEmail } from "../../helperFunctions";

const PersonalData = props => {
  const { form, setForm } = props;
  const { errors, setErrors } = props;
  const {
    setEmailHelpVisible,
    setPasswordHelpVisible,
    setUsernameHelpVisible
  } = props;

  return (
    <>
      <View style={styles.subheader}>
        <Text style={styles.subtitle}>Personal data</Text>
      </View>
      <List style={styles.list}>
        <InputItem
          style={styles.listItem}
          value={form.firstName}
          error={errors.firstName}
          onChange={value => {
            validateRequired(value, setErrors, "firstName");
            setForm(prevState => ({ ...prevState, firstName: value }));
          }}
          onErrorClick={() =>
            Toast.fail(errors.firstName, 0.05 * errors.firstName.length)
          }
          placeholder="First name"
        />
      </List>
      <List style={styles.list}>
        <InputItem
          value={form.lastName}
          style={styles.listItem}
          error={errors.lastName}
          onChange={value => {
            validateRequired(value, setErrors, "lastName");
            setForm(prevState => ({ ...prevState, lastName: value }));
          }}
          onErrorClick={() =>
            Toast.fail(errors.lastName, 0.05 * errors.lastName.length)
          }
          placeholder="Last name"
        />
      </List>
      <List style={styles.list}>
        <InputItem
          style={styles.listItem}
          value={form.email}
          error={errors.email}
          onChange={value => {
            validateEmail(value, setErrors);
            setForm(prevState => ({ ...prevState, email: value }));
          }}
          onErrorClick={() =>
            Toast.fail(errors.email, 0.05 * errors.email.length)
          }
          placeholder="Email"
          onExtraClick={() => setEmailHelpVisible(true)}
          extra={<Icon name="mail" />}
        />
      </List>
      <List style={styles.list}>
        <InputItem
          style={styles.listItem}
          error={errors.username}
          value={form.username}
          onChange={value => {
            validateRequired(value, setErrors, "username");
            setForm(prevState => ({ ...prevState, username: value }));
          }}
          onErrorClick={() =>
            Toast.fail(errors.username, 0.05 * errors.username.length)
          }
          placeholder="Username"
          onExtraClick={() => setUsernameHelpVisible(true)}
          extra={<Icon name="user" />}
        />
      </List>
      <List style={styles.list}>
        <InputItem
          style={styles.listItem}
          error={errors.password}
          onChange={value => {
            validateRequired(value, setErrors, "password");
            setForm(prevState => ({ ...prevState, password: value }));
          }}
          onErrorClick={() =>
            Toast.fail(errors.password, 0.05 * errors.password.length)
          }
          placeholder="Password"
          value={form.password}
          type="password"
        />
      </List>
      <List style={styles.list}>
        <InputItem
          style={styles.listItem}
          value={form.passwordConfirm}
          error={errors.passwordConfirm}
          onChange={value => {
            validateRequired(value, setErrors, "passwordConfirm");
            setForm(prevState => ({
              ...prevState,
              passwordConfirm: value
            }));
          }}
          placeholder="Confrim password"
          onErrorClick={() =>
            Toast.fail(
              errors.passwordConfirm,
              0.05 * errors.passwordConfirm.length
            )
          }
          type="password"
          extra={<Icon name="lock" />}
          onExtraClick={() => setPasswordHelpVisible(true)}
        />
      </List>
    </>
  );
};

export default PersonalData;
