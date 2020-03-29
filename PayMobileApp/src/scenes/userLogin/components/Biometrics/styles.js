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
    marginBottom: "50%"
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 0
  },
  modalText: {
    color: "#061178",
    marginTop: "85%",
    fontSize: 18
  },
  text: {
    alignSelf: "center",
    fontSize: 22,
    paddingTop: 5
  },
  biometricsButton: {
    backgroundColor: "#061178",
    borderWidth: 0,
    marginBottom: 16
  },
  biometricsButtonActive: {
    backgroundColor: "#030852"
  },
  biometricsButtonText: {
    color: "white",
    fontSize: 16
  }
});
