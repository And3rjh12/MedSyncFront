import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, StatusBar } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "./context/ThemeContexts"; 
import styles from "./styles/homeStyles";


// Tipado para la navegación
type RootStackParamList = {
  Home: undefined;
  Agendamiento: undefined;
  BuscarDoctor: undefined;
  BuscarPaciente: undefined;
  Encuentranos: undefined;
  Chat: undefined;
  ChatBot: undefined;
};

type HomeScreenProps = { navigation: StackNavigationProp<RootStackParamList, "Home"> };

// Tipado de datos del clima
interface WeatherData {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
}

// URL de la API del clima
const API_URL = "https://api.openweathermap.org/data/2.5/forecast?q=Quito&units=metric&appid=acd74395733306be9f4925d84e429601";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Validar que 'list' exista y sea un array antes de filtrar
        if (Array.isArray(data.list)) {
          setForecast(data.list.filter((_: any, i: number) => i % 8 === 0));
        } else {
          console.error("Formato de datos inesperado:", data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const buttons = [
    { name: "Agendamiento", icon: require("../../assets/calendar.jpg"), label: "Agendar citas" },
    { name: "BuscarDoctor", icon: require("../../assets/stethoscope.jpg"), label: "Buscar Doctor" },
    { name: "BuscarPaciente", icon: require("../../assets/patients.png"), label: "Buscar Pacientes" },
    { name: "Encuentranos", icon: require("../../assets/map.png"), label: "Encuentranos" },
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Image source={require("../../assets/logo1.png")} style={styles.logo} />
      </View>

      <View style={styles.gridContainer}>
        {buttons.map(({ name, icon, label }) => (
          <TouchableOpacity key={name} style={[styles.gridItem, isDarkMode && styles.darkGridItem]} onPress={() => navigation.navigate(name)}>
            <Image source={icon} style={styles.iconImage} />
            <Text style={[styles.gridText, isDarkMode && styles.darkText]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.weatherContainer, isDarkMode && styles.darkWeatherContainer]}>
        <Text style={[styles.weatherTitle, isDarkMode && styles.darkText]}>Pronóstico del Clima</Text>
        {loading ? (
          <ActivityIndicator size="large" color={isDarkMode ? "#ffffff" : "#0000ff"} />
        ) : (
          <FlatList
            data={forecast}
            keyExtractor={(item) => item.dt_txt}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weatherList}
            renderItem={({ item }) => (
              <View style={[styles.weatherCard, isDarkMode && styles.darkWeatherCard]}>
                <Text style={[styles.weatherDate, isDarkMode && styles.darkText]}>
                  {new Date(item.dt_txt).toLocaleDateString()}
                </Text>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${item.weather?.[0]?.icon}@2x.png` }}
                  style={styles.weatherIcon}
                />
                <Text style={[styles.weatherTemp, isDarkMode && styles.darkText]}>
                  {item.main?.temp?.toFixed(1)}°C
                </Text>
                <Text style={[styles.weatherDesc, isDarkMode && styles.darkText]}>
                  {item.weather?.[0]?.description ?? "No data"}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate("Chat")}>
  <Text style={styles.chatButtonText}>Chat en tiempo real</Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.botButton} onPress={() => navigation.navigate("ChatBot")}>
        <Image source={require("../../assets/bot.png")} style={styles.botImage} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
