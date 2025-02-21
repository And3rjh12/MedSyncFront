import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, StatusBar } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "./context/ThemeContexts"; 
import styles from "./styles/homeStyles";
import ContentLoader, { Rect } from "react-content-loader/native";

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

  // Simular el tiempo de espera de 5 segundos
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (Array.isArray(data.list)) {
          setForecast(data.list.filter((_: any, i: number) => i % 8 === 0));
        } else {
          console.error("Formato de datos inesperado:", data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setTimeout(() => setLoading(false), 2000);
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

  const WeatherSkeleton = () => (
    <View style={[styles.weatherCard, isDarkMode && styles.darkWeatherCard, {
      marginHorizontal: 5,
      borderRadius: 8,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }]}>
      <ContentLoader
        speed={1.5}
        width={120}
        height={150}
        viewBox="0 0 120 150"
        backgroundColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
        foregroundColor={isDarkMode ? '#444444' : '#e3e3e3'}
      >
        {/* Fondo de la tarjeta */}
        <Rect x="0" y="0" rx="8" ry="8" width="120" height="150" />
        
        {/* Fecha */}
        <Rect x="10" y="15" rx="4" ry="4" width="100" height="20" />
        
        {/* Temperatura */}
        <Rect x="20" y="50" rx="4" ry="4" width="80" height="40" />
        
        {/* Descripción del clima */}
        <Rect x="15" y="105" rx="4" ry="4" width="90" height="30" />
      </ContentLoader>
    </View>
  );

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
          <FlatList
            data={[1, 2, 3, 4, 5]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weatherList}
            renderItem={() => <WeatherSkeleton />}
            keyExtractor={(_, index) => index.toString()}
          />
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