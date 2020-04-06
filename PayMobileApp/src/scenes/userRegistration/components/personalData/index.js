import React, { useState, useEffect } from "react";
import styles from "./styles";
import { Text, View } from "react-native";
import {
  List,
  InputItem,
  Toast,
  Icon
} from "@ant-design/react-native";
import { validateRequired, validateEmail, validateConfirmPassword, validateUsername, validateName, validatePassword } from "../../../../helperFunctions";

const PersonalData = props => {
  const { form, setForm } = props;
  const { errors, setErrors } = props;
  const {
    setEmailHelpVisible,
    setPasswordHelpVisible,
    setUsernameHelpVisible
  } = props;

  const {
    checkIcons,
    setCheckIcons
  } = props;

  function renderCheckIcon(fieldName, isFieldIconVisible) {
    if (isFieldIconVisible == true) {
      const keyString = fieldName + "CheckIcon";
      return <View style={styles.rowMemberIcon} key={keyString}>
        < Icon
          name="check-circle"
          color="#40EF6D"
          size="sm"
          onPress={() =>
            Toast.success("The input " + fieldName + " is in correct format")
          }
        />
      </View>
    }
  }

  return (
    <>
      <View style={styles.subheader}>
        <Text style={styles.subtitle}>Personal data</Text>
      </View>
      <List style={styles.list}>
        <View style={styles.row}>
          <View style={styles.rowMemberInput}>
            <InputItem
              style={styles.listItem}
              value={form.firstName}
              error={errors.firstName}
              onChange={value => {
                validateName(value, setErrors, "firstName", setCheckIcons, "firstNameCheckIcon");
                setForm(prevState => ({ ...prevState, firstName: value }));
              }}
              onErrorClick={() =>
                Toast.fail(errors.firstName, 0.05 * errors.firstName.length)
              }
              placeholder="First name"
            />
          </View>
          {
            renderCheckIcon("first name", checkIcons.firstNameCheckIcon)
          }
        </View>
      </List>
      <List style={styles.list}>
        <View style={styles.row}>
          <View style={styles.rowMemberInput}>
            <InputItem
              value={form.lastName}
              style={styles.listItem}
              error={errors.lastName}
              onChange={value => {
                validateName(value, setErrors, "lastName", setCheckIcons, "lastNameCheckIcon");
                setForm(prevState => ({ ...prevState, lastName: value }));
              }}
              onErrorClick={() =>
                Toast.fail(errors.lastName, 0.05 * errors.lastName.length)
              }
              placeholder="Last name"
            />
          </View>
          {
            renderCheckIcon("last name", checkIcons.lastNameCheckIcon)
          }
        </View>
      </List>
      <List style={styles.list}>
        <View style={styles.row}>
          <View style={styles.rowMemberInput}>
            <InputItem
              style={styles.listItem}
              value={form.email}
              error={errors.email}
              onChange={value => {
                validateEmail(value, setErrors, setCheckIcons);
                setForm(prevState => ({ ...prevState, email: value }));
              }}
              onErrorClick={() =>
                Toast.fail(errors.email, 0.05 * errors.email.length)
              }
              placeholder="Email"
              onExtraClick={() => setEmailHelpVisible(true)}
              extra={<Icon name="mail" />}
            />
          </View>
          {
            renderCheckIcon("email", checkIcons.emailCheckIcon)
          }
        </View>

      </List>
      <List style={styles.list}>
        <View style={styles.row}>
          <View style={styles.rowMemberInput}>
            <InputItem
              style={styles.listItem}
              error={errors.username}
              value={form.username}
              onChange={value => {
                validateUsername(value, setErrors, setCheckIcons);
                setForm(prevState => ({ ...prevState, username: value }));
              }}
              onErrorClick={() =>
                Toast.fail(errors.username, 0.05 * errors.username.length)
              }
              placeholder="Username"
              onExtraClick={() => setUsernameHelpVisible(true)}
              extra={<Icon name="user" />}
            />
          </View>
          {
            renderCheckIcon("username", checkIcons.usernameCheckIcon)
          }
        </View>

      </List>
      <List style={styles.list}>
        <View style={styles.row}>
          <View style={styles.rowMemberInput}>
            <InputItem
              style={styles.listItem}
              error={errors.password}
              onChange={value => {
                validatePassword(value, form.passwordConfirm, setErrors, setCheckIcons);
                setForm(prevState => ({ ...prevState, password: value }));
              }}
              onErrorClick={() =>
                Toast.fail(errors.password, 0.05 * errors.password.length)
              }
              placeholder="Password"
              value={form.password}
              type="password"
            />
          </View>
          {
            renderCheckIcon("password", checkIcons.passwordCheckIcon)
          }
        </View>

      </List>
      <List style={styles.list}>
        <View style={styles.row}>
          <View style={styles.rowMemberInput}>
            <InputItem
              style={styles.listItem}
              value={form.passwordConfirm}
              error={errors.passwordConfirm}
              onChange={value => {
                validateConfirmPassword(form.password, value, setErrors, setCheckIcons);
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
          </View>
          {
            renderCheckIcon("Password confirm", checkIcons.passwordConfirmCheckIcon)
          }
        </View>
      </List>
    </>
  );
};

export default PersonalData;