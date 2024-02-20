import { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { WebView } from 'react-native-webview';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

//test

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("status",status)
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getDevicePushTokenAsync()
    console.log(token);
  } else {
    console.log('Real Device To Push Notify');
  }

  return token;
}

export default function App() {
  const [tokenNotify, setTokenNotify] = useState('');
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log("token",token)
      setTokenNotify(token);
    })
     
  }, []);

  return (
    <View style={{ flex: 1}}>
      <WebView
      style={{flex: 1}}
      source={{ uri: 'https://xn--demo-gia-ph-qu9e.vn/family-member/login' }}
    />
    </View>
  );
}
