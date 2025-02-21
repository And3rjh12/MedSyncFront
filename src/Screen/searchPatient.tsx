import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar } from "react-native";
import axios from "axios";
import styles from "./styles/patientSearchStyles"; // Importamos los estilos
import { useTheme } from "./context/ThemeContexts"; // Importamos el contexto del tema

const PatientSearchScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const { isDarkMode, toggleTheme } = useTheme(); // Estado del tema

  const handleSearch = async () => {
    const encodedName = encodeURIComponent(name.trim());

    if (!encodedName) {
      setError("Por favor, ingrese un nombre.");
      setPatientData(null);
      return;
    }

    try {
      console.log(`Haciendo solicitud a: http://192.168.100.47:8000/search_patient/${encodedName}`);
      const response = await axios.get(`http://192.168.100.47:8000/search_patient/${encodedName}`);
      console.log(response);

      if (response.data.patients && response.data.patients.length > 0) {
        setPatientData(response.data.patients[0]);
        setError("");
      } else {
        setError("No se encontró ningún paciente con ese nombre.");
        setPatientData(null);
      }
    } catch (err) {
      setError("Hubo un error al buscar el paciente.");
      setPatientData(null);
    }
  };

  const handleDelete = async () => {
    if (!patientData) return;

    try {
      const response = await axios.delete(`http://192.168.100.47:8000/delete_patient/${name}`);
      if (response.status === 200) {
        setPatientData(null);
        setError("Paciente eliminado correctamente.");
      }
    } catch (err) {
      setError("Hubo un error al eliminar el paciente.");
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <Text style={[styles.title, isDarkMode && styles.darkText]}>Buscar Paciente</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        value={name}
        onChangeText={setName}
        placeholder="Ingrese el nombre del paciente"
        placeholderTextColor={isDarkMode ? "#bbb" : "#777"}
      />
      <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleSearch}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Buscar</Text>
      </TouchableOpacity>

      {error && <Text style={[styles.error, isDarkMode && styles.darkText]}>{error}</Text>}

      {patientData && (
        <View style={[styles.patientDetails, isDarkMode && styles.darkPatientDetails]}>
          <Text style={[styles.patientText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Nombre:</Text> {patientData.name} {patientData.last_name}
          </Text>
          <Text style={[styles.patientText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Correo:</Text> {patientData.email}
          </Text>
          <Text style={[styles.patientText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Edad:</Text> {patientData.age}
          </Text>
          <Text style={[styles.patientText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Teléfono:</Text> {patientData.phone}
          </Text>
          <Text style={[styles.patientText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Especialidad:</Text> {patientData.specialty}
          </Text>

          <TouchableOpacity style={[styles.deleteButton, isDarkMode && styles.darkDeleteButton]} onPress={handleDelete}>
            <Text style={[styles.deleteButtonText, isDarkMode && styles.darkButtonText]}>Eliminar Paciente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PatientSearchScreen;