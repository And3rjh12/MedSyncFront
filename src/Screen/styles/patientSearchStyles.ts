import { StyleSheet } from "react-native";

const patientSearchStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  input: {
    width: "85%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  darkInput: {
    backgroundColor: "#333",
    color: "#fff",
    borderColor: "#555",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  darkButton: {
    backgroundColor: "#1e8e3e",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  darkButtonText: {
    color: "#fff",
  },
  error: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
  patientDetails: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    elevation: 3,
  },
  darkPatientDetails: {
    backgroundColor: "#333",
  },
  patientText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  darkDeleteButton: {
    backgroundColor: "#D32F2F",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  themeToggle: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
});

export default patientSearchStyles;