import { StyleSheet } from "react-native";
export default StyleSheet.create({
  modal: {
    padding: 15,
    flexDirection: "column",
    backgroundColor: "#f0f5ff",
    borderRadius: 6,
  },
  qrModal: {
    backgroundColor: "#f0f5ff",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 25,
    borderRadius: 12,
  },
  qrTitle: { fontSize: 30, padding: 20 },
  submitButton: {
    backgroundColor: "#061178",
    borderColor: "#061178",
  },
  qrOk: {
    backgroundColor: "#061178",
    borderColor: "#061178",
    width: "100%"
  },
  qrCode: {
    width: 300,
  },
  choosingQRTypeList: {
    marginVertical: 10,
    backgroundColor: "#f0f5ff",
  },
  row: {
    flexDirection: "row",
  },
  rowMemberInput: {
    flex: 10,
  },
  rowMemberIcon: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  listItem: {
    paddingVertical: 10,
  },
  moduleTitleText: {
    textAlign: "left",
    paddingVertical: 10,
    fontSize: 20,
    color: "#061178",
    backgroundColor: "#f0f5ff",
    borderWidth: 0,
  },
  list: {
    borderWidth: 1,
    borderColor: "#d6e4ff",
    marginTop: 10,
  },
  radioItemStatic: {
    borderBottomWidth: 0.35,
    borderBottomColor: "black",
  },
  radioItemDynamic: {
    borderTopWidth: 0.35,
    borderTopColor: "black",
  },
  radioItemsView: {
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#f0f5ff",
  },
  backButton: {
    borderRadius: 6,
    borderWidth: 0,
    borderColor: "#061178",
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "#061178",
    fontSize: 16,
  },
});
