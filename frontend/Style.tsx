import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: 58,
    position: "absolute",
    bottom: 30,
    right: 10,
    borderRadius: 35,
    backgroundColor: "#006ee6",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 99,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tripCardSecondaryText: {
    fontSize: 13, color: '#696e6e'
  },
});