import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  modal: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#d6e4ff",
    borderRadius: 25,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalText: {
    color: "#061178",
    fontSize: 18,
  },
});