import { StyleSheet } from "react-native";
export default StyleSheet.create({
  modal: {
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#f0f5ff",
    borderRadius: 6
  },
  subtitle: {
    textAlign: "left",
    padding: 10,
    fontSize: 20,
    color: "#061178"
  },
  subheader: {
    paddingBottom: 10,
    backgroundColor: "#f0f5ff"
  },
  list: {
    borderBottomWidth: 2,
    borderBottomColor: "#d6e4ff"
  },
  listItem: {
    paddingVertical: 10
  },
  nextButton: {
    marginTop: 24,
    backgroundColor: "#061178",
    borderWidth: 0,
  },
  modalText: {
    color: "#061178",
    fontSize: 18,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#f0f5ff",
    borderColor: "#061178",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonHeader: {
    flexDirection: "row",
    justifyContent: "center",
  },
  selectHeader: {
    marginBottom: 24
  },
});