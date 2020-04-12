import { StyleSheet } from "react-native";
export default StyleSheet.create({
  modal: {
    margin: 10,
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#f0f5ff",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: {
    textAlign: "left",
    padding: 10,
    fontSize: 20,
    color: "#061178",
  },
  subheader: {
    paddingBottom: 10,
    backgroundColor: "#f0f5ff",
  },
  picker: {
    paddingLeft: 10,
    backgroundColor: "white",
    marginVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#d6e4ff",
  },
  sortButton: {
    width: "100%",
    marginTop: 30,
    backgroundColor: "#061178",
    borderWidth: 0,
  },

  radioButton: {
    marginBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#d6e4ff",
  },
});
