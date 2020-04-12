import React, { useState } from "react";
import { Alert, Button, View, Text } from "react-native";
import Modal from "react-native-modal";
import SortModal from "./sortModal";

const Transactions = () => {


  const [isSortModalVisible, setSortModalVisible] = useState(false);

  return (
    <View>
      <Text>Transakcije</Text>
      <Modal
        transparent
        isVisible={isSortModalVisible}
        onBackButtonPress={() => {
          setSortModalVisible(false);
        }}
      >
        <SortModal
          setVisible={() => {
            setSortModalVisible();
          }}
        />
      </Modal>

      <Button title="Sort" onPress={() => { setSortModalVisible(true); }} />

    </View>
  );
}


export default Transactions;
