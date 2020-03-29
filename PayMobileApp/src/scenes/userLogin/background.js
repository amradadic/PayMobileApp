import React from "react";
import { Svg, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { View } from "react-native";

const Background = () => (
    <View
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id="grad" x1="-0.2" y1="-0.2" x2="1" y2="1">
            <Stop offset="-32.13%" stopColor="#030852" stopOpacity="1" />
            <Stop offset="110.27%" stopColor="#ADC6FF" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
);

export default Background;
