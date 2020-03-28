import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { InputItem, List, Icon, Button, Toast } from "@ant-design/react-native";
import HelpModal from "./helpModal";
import styles from "./styles";
import { validateRequired, validateForm } from "./helperFunctions";

const UserRegistration = () => {
  const [isLoading, setLoading] = useState(false);
  const [isHelpVisible, setHelpVisible] = useState(false);
  const [form, setForm] = useState({
    firstName: null,
    lastName: null,
    email: null,
    username: null,
    password: null,
    passwordConfirm: null
  });

  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    username: null,
    password: null,
    passwordConfirm: null
  });

  return (
    <ScrollView style={styles.body}>
      <HelpModal setVisible={setHelpVisible} isVisible={isHelpVisible} />
      <View style={styles.header}>
        <Text style={styles.title}>Registracija</Text>
      </View>
      <View style={styles.listView}>
        <List style={styles.list}>
          <InputItem
            style={styles.listItem}
            value={form.firstName}
            error={errors.firstName}
            onChange={value => {
              validateRequired(value, setErrors, "firstName");
              setForm(prevState => ({ ...prevState, firstName: value }));
            }}
            onErrorClick={() => Toast.fail(errors.firstName, 0.5)}
            placeholder="Ime"
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
            onErrorClick={() => Toast.fail(errors.lastName, 0.5)}
            placeholder="Prezime"
          />
        </List>
        <List style={styles.list}>
          <InputItem
            style={styles.listItem}
            value={form.email}
            error={errors.email}
            onChange={value => {
              validateRequired(value, setErrors, "email");
              setForm(prevState => ({ ...prevState, email: value }));
            }}
            onErrorClick={() => Toast.fail(errors.email, 0.5)}
            placeholder="Email"
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
            onErrorClick={() => Toast.fail(errors.username, 0.5)}
            placeholder="Korisničko ime"
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
            onErrorClick={() => Toast.fail(errors.password, 0.5)}
            placeholder="Lozinka"
            value={form.password}
            type="password"
            extra={<Icon name="lock" />}
          />
        </List>
        <List style={styles.list}>
          <InputItem
            style={styles.listItem}
            value={form.passwordConfirm}
            error={errors.passwordConfirm}
            onChange={value => {
              validateRequired(value, setErrors, "passwordConfirm");
              setForm(prevState => ({ ...prevState, passwordConfirm: value }));
            }}
            placeholder="Ponovite lozinku"
            onErrorClick={() => Toast.fail(errors.passwordConfirm, 0.5)}
            type="password"
            extra={<Icon name="question-circle" />}
            onExtraClick={() => setHelpVisible(true)}
          />
        </List>
        <Button
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          type="primary"
          onPress={() => {
            setLoading(true);
            validateForm(form, setErrors);

            setLoading(false);
          }}
        >
          Registruj se!
        </Button>
      </View>
    </ScrollView>
  );
};

export default UserRegistration;
