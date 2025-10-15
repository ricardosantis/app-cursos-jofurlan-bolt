import React, { createContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * @interface NotificationContextType
 * @description Defines the shape of the notification context.
 * @property {(courseId: number, title: string, body: string, seconds: number) => Promise<string>} scheduleCourseReminder - Function to schedule a course reminder notification.
 * @property {(identifier: string) => Promise<void>} cancelNotification - Function to cancel a scheduled notification.
 * @property {boolean} hasPermission - True if the app has permission to send notifications.
 * @property {() => Promise<boolean>} requestPermission - Function to request notification permissions.
 */
interface NotificationContextType {
  scheduleCourseReminder: (courseId: number, title: string, body: string, seconds: number) => Promise<string>;
  cancelNotification: (identifier: string) => Promise<void>;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

/**
 * @const NotificationContext
 * @description The notification context.
 */
export const NotificationContext = createContext<NotificationContextType>({
  scheduleCourseReminder: async () => '',
  cancelNotification: async () => {},
  hasPermission: false,
  requestPermission: async () => false,
});

/**
 * @interface NotificationProviderProps
 * @description Defines the props for the NotificationProvider component.
 * @property {React.ReactNode} children - The child components.
 */
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

/**
 * @function NotificationProvider
 * @description Provides notification state and functions to its children.
 * @param {NotificationProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
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

  /**
   * @function checkPermissions
   * @description Checks if the app has notification permissions.
   */
  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  /**
   * @function requestPermission
   * @description Requests notification permissions from the user.
   * @returns {Promise<boolean>} True if permission is granted, false otherwise.
   */
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

  /**
   * @function scheduleCourseReminder
   * @description Schedules a course reminder notification.
   * @param {number} courseId - The ID of the course.
   * @param {string} title - The title of the notification.
   * @param {string} body - The body of the notification.
   * @param {number} seconds - The number of seconds from now to schedule the notification.
   * @returns {Promise<string>} The notification identifier.
   */
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

  /**
   * @function cancelNotification
   * @description Cancels a scheduled notification.
   * @param {string} identifier - The identifier of the notification to cancel.
   */
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