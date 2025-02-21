import { StyleSheet } from "react-native";

const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  darkSlide: {
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: "100%",
    height: 100,
    paddingVertical: 20,
    borderRadius: 20,
    elevation: 5,
  },
  darkHeader: {
    backgroundColor: "#1e1e1e",
  },
  logo: {
    width: "90%",
    height: "100%",
    resizeMode: "contain",
  },
  medSyncTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  darkText: {
    color: "#ffffff",
  },
  createAccountTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#4CAF50",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 10,
    width: "100%",
  },
  darkInputContainer: {
    borderColor: "#66BB6A",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  darkInput: {
    color: "#ffffff",
    backgroundColor: "#1e1e1e",
  },
  inputIcon: {
    marginRight: 10,
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 16,
  },
  darkPicker: {
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    elevation: 5,
  },
  darkButton: {
    backgroundColor: "#388E3C",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  darkButtonText: {
    color: "#ffffff",
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    marginTop: 15,
    textAlign: "center",
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#eeeeee",
    padding: 10,
    borderRadius: 50,
    elevation: 3,
  },
  darkThemeToggle: {
    backgroundColor: "#333333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
  },
  darkLabel: {
    color: "#ffffff",
  },
});

export default registerStyles;