import { StyleSheet } from "react-native";
export default StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#d6e4ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: "50%",
    marginBottom: "50%",
  },
  modalInsertAmount: {
    padding: 15,
    flexDirection: "column",
    backgroundColor: "#f0f5ff",
    borderRadius: 6
  },
  modalText: {
    color: "#061178",
    marginTop: "85%",
    fontSize: 18,
  },
  title: {
    textAlign: "center",
    padding: 20,
    fontSize: 25,
    color: "#061178",
  },
  header: {
    backgroundColor: "#d6e4ff",
    marginBottom: -50,
  },
  info: {
    marginTop: 40,
    marginLeft: 20,
  },
  list: {
    borderWidth: 1,
    borderColor: "#d6e4ff",
    marginVertical: 10,
    backgroundColor: "#f0f5ff"
  },
  row: {
    flexDirection: "row"
  },
  rowMemberInput: {
    flex: 10
  },
  rowMemberIcon: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4
  },
  listItem: {
    paddingVertical: 10
  },
  moduleTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#f0f5ff"
  },
  choosingAmountList:
  {
    backgroundColor: "#f0f5ff"
  }
});
