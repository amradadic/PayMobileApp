import React from "react";
import { Text, View, Picker } from "react-native";
import { List, InputItem, Toast, Icon } from "@ant-design/react-native";
import styles from "./styles";
import { validateRequired } from "../../../../helperFunctions";

const SecurityQuestion = props => {
  const { form, setForm } = props;
  const { errors, setErrors } = props;
  const {
    selectedQuestion,
    setSelectedQuestion,
    setQuestionHelpVisible
  } = props;

  const { questions } = props;

  return (
    <>
      <View style={styles.subheader}>
        <Text style={styles.subtitle}>Security question</Text>
      </View>
      <List style={styles.list}>
        <Picker
          style={styles.listItem}
          onValueChange={value => setSelectedQuestion(value)}
          selectedValue={selectedQuestion}
        >
          {questions.map((question, index) => (
            <Picker.Item
              label={question.title}
              value={question.id}
              key={index}
            />
          ))}
        </Picker>
      </List>

      <List style={styles.list}>
        <InputItem
          style={styles.listItem}
          value={form.answer}
          error={errors.answer}
          onChange={value => {
            validateRequired(value, setErrors, "answer");
            setForm(prevState => ({
              ...prevState,
              answer: value
            }));
          }}
          placeholder="Your answer"
          onErrorClick={() =>
            Toast.fail(errors.answer, 0.05 * errors.answer.length)
          }
          extra={<Icon name="question-circle" />}
          onExtraClick={() => setQuestionHelpVisible(true)}
        />
      </List>
    </>
  );
};

export default SecurityQuestion;
