import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import FilterModal from "./filterModal";
import Modal from "react-native-modal";

const Transactions = () => {

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  return (
  <View>
    <Text>Transactions</Text>
    <Modal
        transparent
        isVisible={isFilterModalVisible}
        onBackButtonPress={() => {
          setFilterModalVisible(false);
        }}
      >
        <FilterModal
          setVisible={() => {
            setFilterModalVisible();
          }}
        />
      </Modal>

      <Button title="Filter" onPress={() => {setFilterModalVisible(true);}}/>
  </View>
  );
};

export default Transactions;
