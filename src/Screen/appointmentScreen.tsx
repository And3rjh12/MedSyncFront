import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Toast from 'react-native-toast-message';
import axios from "axios";
import { useTheme } from "./context/ThemeContexts";
import { Picker } from "@react-native-picker/picker";
import { Calendar, DateObject } from "react-native-calendars";
import { sendAppointmentNotification } from "./utils/notificationHandler";
interface Doctor {
  id: string;
  name: string;
  last_name: string;
  specialty: string;
  phone: string;
  email: string;
  photo?: string;
}

interface DoctorSchedule {
  [date: string]: {
    selected: boolean;
    marked: boolean;
    selectedColor: string;
    selectedTextColor: string;
    times?: string[];
  };
}

interface Patient {
  id: string;
  name: string;
  last_name: string;
  email: string;
}

export default function AppointmentScreen() {
  
  const [specialty, setSpecialty] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorSchedule, setDoctorSchedule] = useState<DoctorSchedule>({});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [noDoctorsAvailable, setNoDoctorsAvailable] = useState<boolean>(false);
  const [appointmentBooked, setAppointmentBooked] = useState<boolean>(false);
  const [appointmentDetails, setAppointmentDetails] = useState<{
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    reason: string;
    cost: number;
  } | null>(null);
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
  const { isDarkMode } = useTheme();

  const specialtyCosts: { [key: string]: number } = {
    Dermatology: 50,
    Cardiology: 70,
    Pediatrics: 40,
    "General Medicine": 30,
  };

  const showAppointmentNotification = (patientName: string, doctorName: string, date: string, time: string) => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: '¡Cita Agendada Exitosamente!',
      text2: `${patientName} tiene una cita con ${doctorName} el ${date} a las ${time}`,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };


  const formatDateForBackend = (date: string) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString().slice(0, 19).replace("T", " ");
    return formattedDate;
  };

  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://192.168.100.47:8000/patients");
      setPatients(response.data.patients);
    } catch (error: any) {
      console.error("Error loading patients: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    if (!specialty) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.100.47:8000/doctors?specialty=${specialty}`
      );
      setDoctors(response.data.doctors);
      setNoDoctorsAvailable(response.data.doctors.length === 0);
    } catch (error: any) {
      console.error("Error fetching doctors: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorSchedule = async (email: string) => {
    if (!email) return;
    setLoading(true);
    try {
      const sanitizedEmail = encodeURIComponent(email);
      const response = await axios.get(
        `http://192.168.100.47:8000/schedules/${sanitizedEmail}`
      );
      const schedule = response.data.schedules;
      const markedDates: DoctorSchedule = {};

      schedule.forEach((item: { date: string; times: string[] }) => {
        markedDates[item.date] = {
          selected: true,
          marked: true,
          selectedColor: "blue",
          selectedTextColor: "white",
          times: item.times,
        };
      });

      setDoctorSchedule(markedDates);
    } catch (error: any) {
      console.error("Error fetching doctor schedule: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedDate || !reason) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const patientEmail = selectedPatient?.email;
    const doctorEmail = selectedDoctor?.email;

    const selectedDateObj = new Date(selectedDate);
    const currentDateObj = new Date();

    if (selectedDateObj.getTime() < currentDateObj.getTime()) {
      alert("La fecha seleccionada no es válida.");
      return;
    }

    const occupiedTimes = doctorSchedule[selectedDate]?.times || [];
    if (occupiedTimes.includes(selectedTime)) {
      alert("La hora seleccionada ya está ocupada. Por favor, elige otra.");
      return;
    }

    setLoading(true);

    const formattedDate = formatDateForBackend(selectedDate);

    const appointmentData = {
      patient_email: patientEmail,
      doctor_email: doctorEmail,
      date: formattedDate,
      time: selectedTime,
      reason: reason,
      cost: specialtyCosts[selectedDoctor?.specialty || "General Medicine"],
      specialty: selectedDoctor?.specialty,
    };

    try {
      const response = await axios.post(
        "http://192.168.100.47:8000/appointments",
        appointmentData
      );

      if (response.data.message === "Cita agendada exitosamente") {
        alert("Cita agendada exitosamente");
        setAppointmentBooked(true);
        await sendAppointmentNotification(selectedPatient.name,selectedDoctor.name, selectedDate, selectedTime);

        // Guardar los detalles de la cita
        setAppointmentDetails({
          patientName: `${selectedPatient.name} ${selectedPatient.last_name}`,
          doctorName: `${selectedDoctor.name} ${selectedDoctor.last_name}`,
          date: selectedDate,
          time: selectedTime,
          reason: reason,
          cost: specialtyCosts[selectedDoctor.specialty] || 30,
        });

        // Limpiar el formulario
        setSelectedPatient(null);
        setSelectedDoctor(null);
        setSelectedDate(null);
        setReason("");
        setSelectedTime("10:00");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Error booking appointment:", error.response.data);
        alert(
          `Error al agendar la cita: ${
            error.response.data.detail || "Error desconocido"
          }`
        );
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        alert("No se recibió respuesta del servidor");
      } else {
        console.error("Error desconocido:", error.message);
        alert("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayAppointment = async () => {
    if (!appointmentDetails) {
      Alert.alert("Error", "No hay detalles de la cita para procesar el pago.");
      return;
    }
    try {
      // Simular un token de pago
      const simulatedToken = "tok_simulado_123456";

      // Enviar el pago simulado al backend
      const paymentResponse = await axios.post(
        "http://192.168.100.47:8000/process-payment",
        {
          amount: appointmentDetails.cost * 100, // Convertir a centavos
          currency: "usd",
          description: `Pago de cita con ${appointmentDetails.doctorName}`,
          token: simulatedToken,
        }
      );

      if (paymentResponse.data.status === "success") {
        Alert.alert("Éxito", "Pago simulado exitosamente.");
      } else {
        throw new Error("Error al procesar el pago simulado.");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Ocurrió un error al procesar el pago simulado."
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (specialty) {
      fetchDoctors();
    }
  }, [specialty]);

  useEffect(() => {
    if (selectedDoctor?.email) {
      fetchDoctorSchedule(selectedDoctor.email);
    }
  }, [selectedDoctor]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      if (hour !== 17) {
        slots.push(`${hour}:30`);
      }
    }
    return slots;
  };

  return (
    <>
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Agendar Cita
      </Text>

      <Text style={[styles.label, isDarkMode && styles.darkText]}>
        Seleccionar Paciente
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedPatient(item)}
              style={[styles.card, isDarkMode && styles.darkCard]}
            >
              <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>
                {item.name} {item.last_name}
              </Text>
              <Text style={[styles.cardText, isDarkMode && styles.darkText]}>
                Email: {item.email}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedPatient && (
        <View style={[styles.selectedContainer, isDarkMode && styles.darkCard]}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>
            Detalles del Paciente
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Nombre: {selectedPatient.name} {selectedPatient.last_name}
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Email: {selectedPatient.email}
          </Text>
        </View>
      )}

      <Text style={[styles.label, isDarkMode && styles.darkText]}>
        Seleccionar Especialidad
      </Text>
      <Picker
        selectedValue={specialty}
        style={[styles.picker, isDarkMode && styles.darkPicker]}
        onValueChange={(itemValue: any) => setSpecialty(itemValue)}
      >
        <Picker.Item label="Seleccione una especialidad" value="" />
        <Picker.Item label="Dermatología" value="Dermatology" />
        <Picker.Item label="Cardiología" value="Cardiology" />
        <Picker.Item label="Pediatría" value="Pediatrics" />
        <Picker.Item label="Medicina General" value="General Medicine" />
      </Picker>

      {selectedDoctor && (
        <View>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>
            Costo de la cita: ${specialtyCosts[selectedDoctor.specialty] || 30}
          </Text>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>
            Detalles del doctor
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Nombre: {selectedDoctor.name} {selectedDoctor.last_name}
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Email: {selectedDoctor.email}
          </Text>
        </View>
      )}

      {noDoctorsAvailable && !loading && (
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>
          No hay médicos disponibles para esta especialidad.
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedDoctor(item)}
              style={[styles.card, isDarkMode && styles.darkCard]}
            >
              <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>
                {item.name} {item.last_name}
              </Text>
              <Text style={[styles.cardText, isDarkMode && styles.darkText]}>
                Especialidad: {item.specialty}
              </Text>
              <Text style={[styles.cardText, isDarkMode && styles.darkText]}>
                Teléfono: {item.phone}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text style={[styles.label, isDarkMode && styles.darkText]}>
        Seleccionar Fecha
      </Text>
      <Calendar
        current={new Date().toString()}
        markedDates={doctorSchedule}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markingType="custom"
        monthFormat={"yyyy MM"}
      />

      {selectedDate && (
        <Text style={[styles.text, isDarkMode && styles.darkText]}>
          Fecha seleccionada: {selectedDate}
        </Text>
      )}

      <Text style={[styles.label, isDarkMode && styles.darkText]}>
        Seleccionar Hora
      </Text>
      <Picker
        selectedValue={selectedTime}
        style={[styles.picker, isDarkMode && styles.darkPicker]}
        onValueChange={(itemValue) => setSelectedTime(itemValue)}
      >
        {generateTimeSlots().map((time, index) => (
          <Picker.Item key={index} label={time} value={time} />
        ))}
      </Picker>

      {selectedDate &&
        doctorSchedule[selectedDate]?.times?.includes(selectedTime) && (
          <Text style={[styles.errorText, isDarkMode && styles.darkText]}>
            La hora seleccionada ya está ocupada. Por favor, elige otra.
          </Text>
        )}

      <TextInput
        style={[styles.textInput, isDarkMode && styles.darkTextInput]}
        placeholder="Motivo de la cita"
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton]}
        onPress={handleBookAppointment}
      >
        <Text style={[styles.buttonText, isDarkMode && styles.darkText]}>
          Agendar Cita
        </Text>
      </TouchableOpacity>

      {appointmentBooked && (
        <TouchableOpacity
          style={[styles.payButton, isDarkMode && styles.darkPayButton]}
          onPress={handlePayAppointment}
          disabled={loadingPayment}
        >
          {loadingPayment ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.buttonText, isDarkMode && styles.darkText]}>
              Pagar Cita
            </Text>
          )}
        </TouchableOpacity>
      )}

      {appointmentDetails && (
        <View
          style={[styles.appointmentDetails, isDarkMode && styles.darkCard]}
        >
          <Text style={[styles.label, isDarkMode && styles.darkText]}>
            Detalles de la Cita Agendada
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Paciente: {appointmentDetails.patientName}
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Doctor: {appointmentDetails.doctorName}
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Fecha: {appointmentDetails.date}
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Hora: {appointmentDetails.time}
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Motivo: {appointmentDetails.reason}
          </Text>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Costo: ${appointmentDetails.cost}
          </Text>
        </View>
      )}
    </ScrollView>
    <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  payButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  darkPayButton: {
    backgroundColor: "#388E3C",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  darkText: {
    color: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  darkPicker: {
    backgroundColor: "#333",
    color: "#fff",
  },
  card: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    marginVertical: 8,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: "#444",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
  },
  selectedContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  darkTextInput: {
    backgroundColor: "#333",
    color: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  darkButton: {
    backgroundColor: "#388E3C",
  },
  
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  appointmentDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
