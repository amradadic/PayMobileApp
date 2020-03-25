import Constants from "expo-constants";

export default {
  nav: {
    backgroundColor: "#030852",
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    verticalAlign: "middle",
    paddingHorizontal: Constants.statusBarHeight - 2,
    flexDirection: "row"
  },
  logo: {
    color: "white",
    fontFamily: "sans-serif",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "italic"
  },
  burger: {
    padding: 10
  }
};
