import { StyleSheet } from "react-native";

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    alignItems: "center",
  },
  darkFormContainer: {
    backgroundColor: "#1f1f1f",
  },
  title: {
    fontSize: 50,
    fontWeight: "900",
    color: "#4CAF50",
    marginBottom: 20,
    fontFamily: "Roboto",
  },
  darkText: {
    color: "#ffffff",
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: "#f4f8f2",
    borderRadius: 50,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  darkIconContainer: {
    backgroundColor: "#333",
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
    borderColor: "#8BC34A",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  darkInput: {
    color: "#fff",
  },
  inputIcon: {
    marginRight: 10,
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
    backgroundColor: "#1B5E20",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  darkButtonText: {
    color: "#ddd",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 8,
  },
  registerText: {
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 16,
  },
  darkRegisterText: {
    color: "#8BC34A",
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 16,
  },
  socialIconButton: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 50,
    backgroundColor: "#f4f8f2",
    elevation: 5,
  },
  darkSocialIconButton: {
    backgroundColor: "#444",
  },
  biometricButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  darkBiometricButton: {
    backgroundColor: "#2E7D32",
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  themeToggle: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  darkThemeToggle: {
    backgroundColor: "#333",
  },
});

export default loginStyles;