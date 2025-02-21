import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, StatusBar, Image } from "react-native";
import Swiper from "react-native-swiper";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import styles from "./styles/registerStyles"; // Importa tus estilos
import { useTheme } from "./context/ThemeContexts";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("patient");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [message, setMessage] = useState("");
  const { isDarkMode, toggleTheme } = useTheme();

  const BASE_URL = "http://192.168.100.47:8000";

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        email,
        password,
        name,
        last_name: lastName,
        role,
        age: age ? parseInt(age) : null,
        gender,
        phone,
        ...(role === "doctor" ? { specialty } : {}),
      });
      setMessage(response.data.message || "User created successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.detail || `Error: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, isDarkMode && styles.darkContainer]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Swiper loop={false} showsPagination={true} dotColor="#ccc" activeDotColor="#4CAF50">
          
          {/* 🔹 Página 1: Datos personales */}
          <View style={[styles.slide, isDarkMode && styles.darkSlide]}>
            <View style={[styles.header, isDarkMode && styles.darkHeader]}>
              <Image source={require("../../assets/logo1.png")} style={styles.logo} />
            </View>
        
            <Text style={[styles.medSyncTitle, isDarkMode && styles.darkText]}>MedSync</Text>
            <Text style={[styles.createAccountTitle, isDarkMode && styles.darkText]}>Crear Cuenta</Text>

            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput style={[styles.input, isDarkMode && styles.darkInput]} placeholder="Nombre" placeholderTextColor={isDarkMode ? "#aaa" : "#000"} value={name} onChangeText={setName} />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput style={[styles.input, isDarkMode && styles.darkInput]} placeholder="Apellido" placeholderTextColor={isDarkMode ? "#aaa" : "#000"} value={lastName} onChangeText={setLastName} />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput style={[styles.input, isDarkMode && styles.darkInput]} placeholder="Correo" placeholderTextColor={isDarkMode ? "#aaa" : "#000"} value={email} onChangeText={setEmail} />
            </View>
          </View>

          {/* 🔹 Página 2: Seguridad */}
          <View style={[styles.slide, isDarkMode && styles.darkSlide]}>
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
              <Image source={require("../../assets/logo1.png")} style={styles.logo} />
            </View>
            <Text style={[styles.createAccountTitle, isDarkMode && styles.darkText]}>Información de Seguridad</Text>

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput style={[styles.input, isDarkMode && styles.darkInput]} placeholder="Contraseña" placeholderTextColor={isDarkMode ? "#aaa" : "#000"} secureTextEntry value={password} onChangeText={setPassword} />
            </View>
          </View>

          {/* 🔹 Página 3: Datos Personales */}
          <View style={[styles.slide, isDarkMode && styles.darkSlide]}>
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
              <Image source={require("../../assets/logo1.png")} style={styles.logo} />
            </View>
            <Text style={[styles.createAccountTitle, isDarkMode && styles.darkText]}>Datos Personales</Text>

            <Text style={[styles.label, isDarkMode && styles.darkText]}>Rol</Text>
            <Picker selectedValue={role} onValueChange={setRole} style={[styles.picker, isDarkMode && styles.darkPicker]}>
              <Picker.Item label="Paciente" value="patient" />
              <Picker.Item label="Doctor" value="doctor" />
            </Picker>

            <View style={styles.inputContainer}>
              <FontAwesome name="calendar" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput style={[styles.input, isDarkMode && styles.darkInput]} placeholder="Edad" keyboardType="numeric" placeholderTextColor={isDarkMode ? "#aaa" : "#000"} value={age} onChangeText={setAge} />
            </View>

            <Text style={[styles.label, isDarkMode && styles.darkText]}>Género</Text>
            <Picker selectedValue={gender} onValueChange={setGender} style={[styles.picker, isDarkMode && styles.darkPicker]}>
              <Picker.Item label="Masculino" value="male" />
              <Picker.Item label="Femenino" value="female" />
            </Picker>
          </View>

          {/* 🔹 Página 4: Contacto */}
          <View style={[styles.slide, isDarkMode && styles.darkSlide]}>
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
              <Image source={require("../../assets/logo1.png")} style={styles.logo} />
            </View>
            <Text style={[styles.createAccountTitle, isDarkMode && styles.darkText]}>Información de Contacto</Text>

            <View style={styles.inputContainer}>
              <FontAwesome name="phone" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput style={[styles.input, isDarkMode && styles.darkInput]} placeholder="Teléfono" keyboardType="phone-pad" placeholderTextColor={isDarkMode ? "#aaa" : "#000"} value={phone} onChangeText={setPhone} />
            </View>

            {role === "doctor" && (
              <View style={styles.inputContainer}>
                <FontAwesome name="stethoscope" size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput style={[styles.input, isDarkMode && styles.darkInput]} placeholder="Especialidad" placeholderTextColor={isDarkMode ? "#aaa" : "#000"} value={specialty} onChangeText={setSpecialty} />
              </View>
            )}
          </View>

          {/* 🔹 Página 5: Confirmación */}
          <View style={[styles.slide, isDarkMode && styles.darkSlide]}>
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
              <Image source={require("../../assets/logo1.png")} style={styles.logo} />
            </View>
            <Text style={[styles.createAccountTitle, isDarkMode && styles.darkText]}>Finalizar Registro</Text>

            <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleRegister}>
              <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Registrarse</Text>
            </TouchableOpacity>

            {message && <Text style={[styles.message, isDarkMode && styles.darkText]}>{message}</Text>}
          </View>
        </Swiper>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}