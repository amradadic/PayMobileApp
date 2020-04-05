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
  list: {
    borderBottomWidth: 2,
    borderBottomColor: "#d6e4ff"
  },
  listItem: {
    paddingVertical: 10
  },
  modalText: {
    color: "#061178",
    fontSize: 18,
  },
  item: {
    marginTop: 20,
    padding:30,
    fontSize: 20

  },
  button: {
    marginTop: 24,
    backgroundColor: "#061178",
    borderWidth: 0,
    borderRadius: 0
  },
  item2: {
    marginTop: 20,
    padding:30,
    fontSize: 15

  }
});
