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
    paddingBottom: 10,
    backgroundColor: "#f0f5ff",
  },
  list: {
    borderBottomWidth: 2,
    borderBottomColor: "#d6e4ff",
  },
  listItem: {
    paddingVertical: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#061178",
    borderWidth: 0,
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
