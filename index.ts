import { registerRootComponent } from 'expo';
import App from './App';
import * as Notifications from 'expo-notifications';

// Listener para notificaciones cuando la app está en segundo plano
Notifications.addNotificationResponseReceivedListener(response => {
  console.log('Notificación recibida:', response);
});

registerRootComponent(App);