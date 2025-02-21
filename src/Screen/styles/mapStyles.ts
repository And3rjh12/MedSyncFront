import { StyleSheet } from "react-native";

const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

export default mapStyles;