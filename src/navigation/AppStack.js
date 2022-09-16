import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import UserLocation from '../screens/userLocation';
import CurrenciesChart from '../screens/currenciesChart';

const Stack = createStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Location" component={UserLocation} />
      <Stack.Screen name="Chart" component={CurrenciesChart} />
    </Stack.Navigator>
  );
}

export default AppStack;
