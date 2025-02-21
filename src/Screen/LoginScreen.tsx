import React, { useState, useEffect } from "react";
import { 
  View, TextInput, Text, ActivityIndicator, TouchableOpacity, 
  KeyboardAvoidingView, Platform, StatusBar 
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import axios from "axios";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles/loginStyles";
import { useTheme } from "./context/ThemeContexts"; // Importamos el contexto de tema

interface LoginResponse {
  token: string;
}

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<LoginResponse>(
        "http://192.168.100.47:8000/login", 
        { email, password }
      );
      setToken(response.data.token);
      setError("");
      navigation.navigate("Home");
    } catch (err) {
      setError("Email o contraseña inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const biometricRecords = await LocalAuthentication.isEnrolledAsync();
      if (!biometricRecords) {
        setError("No hay datos biométricos registrados.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación biométrica",
        fallbackLabel: "Usar contraseña",
      });

      if (result.success) {
        navigation.navigate("Home");
      } else {
        setError("Autenticación fallida.");
      }
    } catch (error) {
      console.error("Error en autenticación biométrica:", error);
      setError("Error en autenticación biométrica.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, isDarkMode && styles.darkContainer]} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Botón de modo oscuro en la esquina superior derecha */}
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <FontAwesome name={isDarkMode ? "sun-o" : "moon-o"} size={24} color={isDarkMode ? "#ffdd57" : "#222"} />
      </TouchableOpacity>

      <View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>MedSync</Text>

        <View style={styles.iconContainer}>
          <FontAwesome name="stethoscope" size={50} color="#4CAF50" />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#4CAF50" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Email"
            placeholderTextColor={isDarkMode ? "#aaa" : "#000"}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#4CAF50" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Contraseña"
            placeholderTextColor={isDarkMode ? "#aaa" : "#000"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Ingresar</Text>}
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}
        {token && <Text style={styles.success}>¡Inicio de sesión exitoso!</Text>}

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.registerText, isDarkMode && styles.darkText]}>¿No tienes una cuenta? Regístrate</Text>
        </TouchableOpacity>

        <View style={styles.socialIconsContainer}>
          {isBiometricSupported && (
            <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
              <MaterialIcons name="fingerprint" size={40} color={isDarkMode ? "#fff" : "#252625"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
