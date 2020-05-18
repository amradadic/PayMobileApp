import renderer from "react-test-renderer";
import React from 'react';
import 'react-native';



test("initial test", () => {
    /*let data = renderer.create(<UserLogin/>).getInstance();*/
    let num=20;
    expect(num).toEqual(20);
  });