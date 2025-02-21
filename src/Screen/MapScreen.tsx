// @ts-ignore - Ignore TypeScript warning about missing types
import polyline from "@mapbox/polyline";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import styles from "./styles/mapStyles";

const MapScreen: React.FC = () => {
  const [directions, setDirections] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isDirectionsLoading, setIsDirectionsLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null); // Estimated time
  const [totalDistance, setTotalDistance] = useState<string | null>(null); // Total distance

  const locations = [
    {
      id: 1,
      title: "Sucursal Sur",
      description: "Ubicada en el sur de Quito.",
      latitude: -0.32635,
      longitude: -78.5494,
    },
    {
      id: 2,
      title: "Sucursal Norte",
      description: "Ubicada en el norte de Quito.",
      latitude: -0.18065,
      longitude: -78.46784,
    },
  ];

  const googleMapsApiKey = 'AIzaSyBuxWNDjHkFH0IM-WYtLR09FAPEyeyCOdA'; 


  //Request location permissions
  const requestPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "No se puede obtener la ubicación sin permisos.");
      return false;
    }
    return true;
  };

  //Get the user's location
  const getUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setIsLocationLoading(false);
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación.");
      setIsLocationLoading(false);
    }
  };

  // Gets the route between the user and the selected destination
  const fetchDirections = useCallback(async (destination: any) => {
    if (!userLocation) return;

    setIsDirectionsLoading(true);
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destinationCoords = `${destination.latitude},${destination.longitude}`;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destinationCoords}&key=${googleMapsApiKey}`
      );

      if (response.data.status === "OK" && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const routeLeg = route.legs[0];

        // Decode the polyline for the correct route
        const decodedPoints = polyline
          .decode(route.overview_polyline.points)
          .map(([latitude, longitude]) => ({ latitude, longitude }));

        // Extract distance and estimated time
        setTotalDistance(routeLeg.distance.text); // estimated time
        setEstimatedTime(routeLeg.duration.text); // total distance

        setDirections(decodedPoints);
      } else {
        throw new Error("No se encontraron rutas disponibles.");
      }
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
      Alert.alert("Error", "No se pudo obtener la ruta.");
    } finally {
      setIsDirectionsLoading(false);
    }
  }, [userLocation]);

  // manage the selection of a branch
  const handleMarkerPress = (location: any) => {
    setSelectedLocation(location);
    fetchDirections(location);
  };

  // initializes the user's location when the component loads
  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        getUserLocation();
      }
    };
    init();
  }, []);

  if (isLocationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* 🔹 user Bookmark */}
        <Marker
          coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
          title="Tu ubicación"
          pinColor="blue"
        />

        {/* 🔹 branch Markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.title}
            description={location.description}
            onPress={() => handleMarkerPress(location)}
          />
        ))}

        {/* 🔹 correct route with the polyline */}
        {directions && selectedLocation && (
          <Polyline coordinates={directions} strokeColor="#FF6347" strokeWidth={4} />
        )}
      </MapView>

      {/* 🔹 route information */}
      {directions && selectedLocation && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Dirección seleccionada: {selectedLocation.title}</Text>
          <Text style={styles.infoText}>
            Tiempo estimado: {estimatedTime || "Calculando..."}
          </Text>
          <Text style={styles.infoText}>
            Distancia: {totalDistance || "Calculando..."}
          </Text>
        </View>
      )}

      {/* 🔹 button to update addresses */}
      {selectedLocation && (
        <Button title="Actualizar Ruta" onPress={() => fetchDirections(selectedLocation)} />
      )}
    </View>
  );
};

export default MapScreen;