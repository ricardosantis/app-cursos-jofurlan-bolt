import React, { createContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface NotificationContextType {
  scheduleCourseReminder: (courseId: number, title: string, body: string, seconds: number) => Promise<string>;
  cancelNotification: (identifier: string) => Promise<void>;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

export const NotificationContext = createContext<NotificationContextType>({
  scheduleCourseReminder: async () => '',
  cancelNotification: async () => {},
  hasPermission: false,
  requestPermission: async () => false,
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermissions();
    
    // Configure notification behavior
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { notification } = response;
      const data = notification.request.content.data;
      
      // Handle notification tap - e.g., navigate to specific course
      console.log('Notification tapped:', data);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      // Web doesn't support push notifications in the same way
      return false;
    }
    
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  };

  const scheduleCourseReminder = async (courseId: number, title: string, body: string, seconds: number) => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        throw new Error('Notification permission not granted');
      }
    }
    
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { courseId },
      },
      trigger: { seconds },
    });
    
    return identifier;
  };

  const cancelNotification = async (identifier: string) => {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  };

  return (
    <NotificationContext.Provider value={{
      scheduleCourseReminder,
      cancelNotification,
      hasPermission,
      requestPermission,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};