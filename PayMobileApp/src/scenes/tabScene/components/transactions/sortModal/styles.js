import { StyleSheet } from "react-native";
export default StyleSheet.create({
  modal: {
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#f0f5ff",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: 'space-between',
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
  listItem: {
    paddingVertical: 10
  },
  nextButton: {
    marginTop: 24,
    backgroundColor: "#061178",
    borderWidth: 0,
  },

  pickerHeader: {
    marginTop: 30
  },

  radioButtonGroup: {
    flexDirection: "row",

  },
  rbstil: {

    width: 50

  },
  txtstil: {
    //marginRight: "auto",
    fontSize: 15,
    fontWeight: '700'
  }
});