import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  circle: {
    height: 30,
    width: 30,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#794F9B',
  },
});
