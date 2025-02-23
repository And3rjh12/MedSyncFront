import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./context/ThemeContexts"; 

interface Doctor {
  id: string;
  name: string;
  email: string;
  last_name: string;
  specialty: string;
}

interface Schedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
}

interface DoctorSchedule {
  email: string;
  schedule: Schedule;
}

const DoctorScheduleScreen: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [schedule, setSchedule] = useState<Schedule>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nombres de los días para mostrar
  const dayNames = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://192.168.100.47:8000/doctors");
      const data = await response.json();
      if (data.doctors) {
        setDoctors(data.doctors);
      }
    } catch (err) {
      setError("Error al cargar los doctores");
      Alert.alert("Error", "No se pudieron cargar los doctores");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorSchedule = async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.100.47:8000/schedules/${email}`
      );
      const data = await response.json();

      if (data.schedule) {
        setSchedule(data.schedule);
      } else {
        // Si no hay horario, inicializar uno vacío
        setSchedule({
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
        });
      }
    } catch (err) {
      console.error("Error al obtener horario:", err);
      // Si hay error, asumimos que no hay horario
      setSchedule({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = async (doctorEmail: string) => {
    const doctor = doctors.find((d) => d.email === doctorEmail);
    if (doctor) {
      setSelectedDoctor(doctor);
      await fetchDoctorSchedule(doctor.email);
    }
  };

  const addTimeSlot = (day: keyof Schedule) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], "09:00"],
    }));
  };

  const removeTimeSlot = (day: keyof Schedule, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const updateTimeSlot = (day: keyof Schedule, index: number, time: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((t, i) => (i === index ? time : t)),
    }));
  };

  const saveSchedule = async () => {
    if (!selectedDoctor) return;

    try {
      setLoading(true);
      const response = await fetch(
        "http://192.168.100.47:8000/register_schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: selectedDoctor.email,
            ...schedule,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Éxito", "Horario guardado correctamente");
      } else {
        throw new Error("Error al guardar el horario");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo guardar el horario");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>Gestión de Horarios</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDoctor?.email || ""}
              onValueChange={handleDoctorSelect}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="✨ Seleccione un doctor" value="" />
              {doctors.map((doctor) => (
                <Picker.Item
                  key={doctor.email}
                  label={`👨‍⚕️ ${doctor.name} ${doctor.last_name} - ${doctor.specialty}`}
                  value={doctor.email}
                />
              ))}
            </Picker>
          </View>

          {selectedDoctor && (
            <View style={styles.scheduleContainer}>
              {Object.entries(dayNames).map(([day, dayName]) => (
                <View key={day} style={styles.dayContainer}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayTitle}>{dayName}</Text>
                    <TouchableOpacity
                      onPress={() => addTimeSlot(day as keyof Schedule)}
                      style={styles.addButton}
                    >
                      <Text style={styles.addButtonText}>+ Agregar</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {schedule[day as keyof Schedule].map((time, index) => (
                    <View key={index} style={styles.timeSlotContainer}>
                      <View style={styles.timePickerWrapper}>
                        <Text style={styles.timeIcon}>🕒</Text>
                        <Picker
                          selectedValue={time}
                          onValueChange={(value) =>
                            updateTimeSlot(day as keyof Schedule, index, value)
                          }
                          style={styles.timePicker}
                        >
                          {Array.from({ length: 17 }, (_, i) => {
                            const hour = 9 + Math.floor(i / 2);
                            const minutes = i % 2 === 0 ? "00" : "30";
                            const time = `${hour.toString().padStart(2, "0")}:${minutes}`;
                            return (
                              <Picker.Item key={time} label={time} value={time} />
                            );
                          })}
                        </Picker>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeTimeSlot(day as keyof Schedule, index)}
                        style={styles.removeButton}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}

              <TouchableOpacity
                onPress={saveSchedule}
                style={styles.saveButton}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>💾 Guardar Horarios</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#1A237E",
    letterSpacing: 0.5,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    fontSize: 16,
  },
  scheduleContainer: {
    gap: 20,
  },
  dayContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A237E",
  },
  timeSlotContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 8,
  },
  timePickerWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
  },
  timeIcon: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 8,
  },
  timePicker: {
    flex: 1,
    height: 50,
  },
  removeButton: {
    backgroundColor: "#FF5252",
    padding: 8,
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#1976D2",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    padding: 18,
    borderRadius: 12,
    marginTop: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default DoctorScheduleScreen;
