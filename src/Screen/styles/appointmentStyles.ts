import { StyleSheet } from "react-native";

const appointmentStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 15,
  },
  patientInfo: {
    marginTop: 30,
  },
  text: {
    fontSize: 30,
    color: '#333',
  },
  datePickerButton: {
    marginVertical: 10,
  },
  timePickerButton: {
    marginVertical: 10,
  },
});

export default appointmentStyles;
