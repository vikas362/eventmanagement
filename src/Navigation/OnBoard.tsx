import * as React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Screen/Authentication/Login';

const Stack = createNativeStackNavigator();

/**
 * Render the OnBoard stack navigator.
 *
 * @returns JSX.Element
 */
function OnBoard(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

export default OnBoard;
