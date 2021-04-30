import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

export async function useLocalNotification(title: any, body: any, milisecond: any, second: any) {
    return await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: 1,
            schedule: { at: new Date(Date.now() + milisecond * second) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: null
          }
        ]
      });
}