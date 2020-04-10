import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  modal: {
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#f0f5ff",
    borderRadius: 6,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 10,
  },
  modalText: {
    color: "#061178",
    fontSize: 18,
  },
  subtitle: {
    textAlign: "left",
    padding: 10,
    fontSize: 20,
    color: "#061178",
  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    backgroundColor: "#f0f5ff",
  },
  additionalData: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#d6e4ff",
    padding: 0,
  },
  list: {
    marginBottom: 0,
    padding: 0,
  },
  additionalDataText: {
    fontSize: 17,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#061178",
    borderWidth: 0,
  },
});
