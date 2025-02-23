import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export async function requestNotificationPermissions() {
  let status = (await Notifications.getPermissionsAsync()).status;

  
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }

  return status === 'granted';
}


export async function sendAppointmentNotification(patientName: string,doctorName: string, date: string, time: string) {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Cita Agendada con Éxito! 🎉',
      body: `Paciente ${patientName} , agendo su cita con el Dr. ${doctorName} está programada para el ${date} a las ${time}.`,
      sound: true,
    },
    trigger: null, 
  });
}
