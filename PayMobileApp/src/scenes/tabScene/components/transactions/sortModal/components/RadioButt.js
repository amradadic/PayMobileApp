import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import styles from "./styles";
export default class RadioButt extends Component {
  state = {
    value: "null",
  };

  render() {
    const { options } = this.props;
    const { value } = this.state;

    return (
      <View>
        {options.map(item => {
          return (
            <View key={item.key} style={styles.buttonContainer}>
              <Text>{item.text}</Text>
              <TouchableOpacity

                style={styles.circle}
                onPress={() => {
                  this.setState({
                    value: item.key,
                  });
                  //console.log(item.text);
                  this.props.fun(item.text);
                }}
              >
                {value === item.key && <View style={styles.checkedCircle} />}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}

