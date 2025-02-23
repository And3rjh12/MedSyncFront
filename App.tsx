
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider, useTheme } from "./src/Screen/context/ThemeContexts"; // Importamos el ThemeProvider
import { StatusBar, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import LoginScreen from "./src/Screen/LoginScreen";
import HomeScreen from "./src/Screen/HomeScreen";
import RegisterScreen from "./src/Screen/RegisterScreen";
import MapScreen from "./src/Screen/MapScreen";
import AppointmentScreen from "./src/Screen/appointmentScreen";
import PatientSearchScreen from "./src/Screen/searchPatient";
import DoctorSearchScreen from "./src/Screen/searchDoctor";
import DoctorScheduleScreen from "./src/Screen/DoctorScheduleScreen";


const Stack = createStackNavigator();

function MainNavigator() {
  const { isDarkMode, toggleTheme } = useTheme(); // Accede al modo oscuro

  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerRight: () => (
              <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
                <FontAwesome name={isDarkMode ? "sun-o" : "moon-o"} size={24} color={isDarkMode ? "#ffdd57" : "#222"} />
              </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff" },
            headerTintColor: isDarkMode ? "#ffffff" : "#000000",
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú Principal" }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Registro de Usuario" }} />
          <Stack.Screen name="Agendamiento" component={AppointmentScreen} options={{ title: "Agendamiento" }} />
          <Stack.Screen name="BuscarPaciente" component={PatientSearchScreen} options={{ title: "Buscar Paciente" }} />
          <Stack.Screen name="BuscarDoctor" component={DoctorSearchScreen} options={{ title: "Buscar Doctor" }} />
          <Stack.Screen name="DoctorHorario" component={DoctorScheduleScreen} options={{ title: "Dotor Horario" }} />
          <Stack.Screen name="Encuentranos" component={MapScreen} options={{ title: "Mapa de Sucursales" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainNavigator/>
    </ThemeProvider>
  );
}