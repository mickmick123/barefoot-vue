import { Plugins, PushNotification } from '@capacitor/core';
const { PushNotifications } = Plugins;
import { FCM } from "capacitor-fcm";
const fcm = new FCM();

export default {
  async pushInit() {
    try {
      PushNotifications.addListener('registrationError', (error) =>          {
        console.log(`error on register ${JSON.stringify(error)}`);
      });
      
      PushNotifications.addListener('pushNotificationReceived', (notification) =>          {
        console.log(`notification ${JSON.stringify(notification)}`);
      });
      
      PushNotifications.addListener('pushNotificationActionPerformed',async (notification) => {
          // Do something
      });
      
      PushNotifications.register();
      const fcmToken = await fcm.getToken();
      console.log(fcmToken)
    } catch (e) {
      console.log(e);
    }
  },
};