import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import {getGeoLocation} from '../../services';
import {Colors} from '../../theme';

const UserLocation = ({navigation}) => {
  const [address, setAddress] = useState('');

  const getPosition = () => {
    Geolocation.getCurrentPosition(
      async location => {
        const {latitude, longitude} = location.coords;
        const geoLocation = await getGeoLocation(latitude, longitude).catch(
          err => console.error(err),
        );
        geoLocation &&
          setAddress(`${geoLocation.city}, ${geoLocation.country}`);
      },
      err => {
        console.error(err);
      },
      {timeout: 20000, enableHighAccuracy: true, maximumAge: 1000},
    );
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ])
        .then(granted => {
          if (
            granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
            granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
          ) {
            getPosition();
          } else {
            console.log('Permission not granted');
          }
        })
        .catch(err => {
          console.error('error: ', err);
        });
    } else {
      const result = await Geolocation.requestAuthorization('always');
      if (result === 'granted') {
        getPosition();
      } else {
        // Linking.openURL('app-settings:');
      }
    }
  };

  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Text style={styles.text}>Where are you from ?</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <Button
        disabled={!address}
        title="Ok"
        onPress={() => navigation.navigate('Chart')}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', paddingHorizontal: '10%'},
  text: {textAlign: 'center', fontSize: 25, color: Colors.black},
  input: {
    marginVertical: 30,
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lineGrey,
    borderRadius: 10,
  },
});

export default UserLocation;
