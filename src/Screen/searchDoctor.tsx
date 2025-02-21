import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar } from "react-native";
import axios from "axios"; 
import styles from "./styles/doctorSearchStyles";
import { useTheme } from "./context/ThemeContexts";  // import styles

const DoctorSearchScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [doctorData, setDoctorData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const { isDarkMode, toggleTheme } = useTheme();
  const handleSearch = async () => {
    const encodedName = encodeURIComponent(name.trim());

    if (!encodedName) {
      setError("Por favor, ingrese un nombre.");
      setDoctorData(null);
      return;
    }

    try {
      console.log(`Haciendo solicitud a: http://192.168.100.47:8000/search_doctor/${encodedName}`);
      const response = await axios.get(`http://192.168.100.47:8000/search_doctor/${encodedName}`);
      console.log(response);

      if (response.data.doctors && response.data.doctors.length > 0) {
        setDoctorData(response.data.doctors[0]); 
        setError("");
      } else {
        setError("No se encontró ningún doctor con ese nombre.");
        setDoctorData(null);
      }
    } catch (err) {
      console.log(err);
      setError("Hubo un error al buscar el doctor.");
      setDoctorData(null);
    }
  };

  const handleDelete = async () => {
    if (!doctorData) return;
    
    try {
      const response = await axios.delete(`http://192.168.100.47:8000/delete_doctor/${name}`);
      if (response.status === 200) {
        setDoctorData(null); 
        setError("Doctor eliminado correctamente.");
      }
    } catch (err) {
      setError("Hubo un error al eliminar el doctor.");
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Buscar Doctor</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        value={name}
        onChangeText={setName}
        placeholder="Ingrese el nombre del doctor"
        placeholderTextColor={isDarkMode ? "#bbb" : "#777"}
      />
<TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleSearch}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Buscar</Text>
      </TouchableOpacity>

      {error && <Text style={[styles.error, isDarkMode && styles.darkText]}>{error}</Text>}

      {doctorData && (
        <View style={[styles.doctorDetails, isDarkMode && styles.darkDoctorDetails]}>
          <Text style={[styles.doctorText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Nombre:</Text> {doctorData.name} {doctorData.last_name}
          </Text>
          <Text style={[styles.doctorText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Correo:</Text> {doctorData.email}
          </Text>
          <Text style={[styles.doctorText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Especialidad:</Text> {doctorData.specialty}
          </Text>
          <Text style={[styles.doctorText, isDarkMode && styles.darkText]}>
            <Text style={[styles.bold, isDarkMode && styles.darkText]}>Teléfono:</Text> {doctorData.phone}
          </Text>

          <TouchableOpacity style={[styles.deleteButton, isDarkMode && styles.darkDeleteButton]} onPress={handleDelete}>
            <Text style={[styles.deleteButtonText, isDarkMode && styles.darkButtonText]}>Eliminar Doctor</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DoctorSearchScreen;