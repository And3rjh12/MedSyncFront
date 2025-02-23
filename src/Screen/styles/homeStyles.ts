import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F0F2",
    alignItems: "center",
    padding: 14,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
 
  scrollViewContent: {
    flexGrow: 1, // Esto asegura que el contenido pueda ocupar toda la altura disponible
    alignItems: 'center', // Alineación de los elementos hijos
    justifyContent: 'flex-start', // Asegura que el contenido comience desde la parte superior
  },
  darkScrollViewContent: {
    backgroundColor: '#444',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: "105%",
    height: 119,
    paddingVertical: 20,
    borderRadius: 20,
    elevation: 5,
  },
  darkHeader: {
    backgroundColor: "#1f1f1f",
  },
  logo: {
    width: "90%",
    height: "160%",
    resizeMode: "contain",
    backgroundColor: "#1f1f1f",  ///aqui para aplicar el dark mode en home
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    
  },
  darkText: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#6E6E6E",
    letterSpacing: 1,
  },
  darkSubtitle: {
    color: "#aaa",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "95%",
    marginTop: 20,
    
  },
  gridItem: {
    width: "42%",
    height: 90,
    backgroundColor: "#ffffff",
    margin: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  darkGridItem: {
    backgroundColor: "#333",
  },
  gridText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  darkGridText: {
    color: "#fff",
  },
  iconImage: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    
  },
  
  weatherContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  darkWeatherContainer: {
    backgroundColor: "#222",
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  darkWeatherTitle: {
    color: "#fff",
  },
  weatherList: {
    alignItems: "center",
  },
  weatherCard: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
    width: 120,
  },
  darkWeatherCard: {
    backgroundColor: "#444",
  },
  weatherDate: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffdd57",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherDesc: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize",
  },
  
  chatButton: {
    marginTop: 20,
    backgroundColor: "#D1D1D1",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  darkChatButton: {
    backgroundColor: "#444",
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  darkChatButtonText: {
    color: "#fff",
  },
  botButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  darkBotButton: {
    backgroundColor: "#333",
  },
  botImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  
});

export default homeStyles;