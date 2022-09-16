import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {LogBox, SafeAreaView, Alert, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppStack from './navigation/AppStack';
import {Colors} from './theme';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  const askForNotificationPermission = async () => {
    try {
      const notificationPermission = await AsyncStorage.getItem(
        '@notification',
      );
      if (!notificationPermission) {
        Alert.alert(
          '"Currency Exchange" Would Like to Send You Notifications',
          'Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.',
          [
            {text: "Don't Allow", style: 'cancel'},
            {
              text: 'OK',
              onPress: async () =>
                await AsyncStorage.setItem('@notification', 'OK'),
            },
          ],
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    askForNotificationPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
});

export default App;
