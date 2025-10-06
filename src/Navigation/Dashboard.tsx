import * as React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../Screen/Dashboard';
import EventDetailsScreen from '../Screen/Dashboard/EventDetails';
import GuestList from '../Screen/Dashboard/GuestList';

const Stack = createNativeStackNavigator();

/**
 * Dashboard component
 *
 * @return {React.ReactElement} The Dashboard component
 */
function Dashboard(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="GuestList" component={GuestList} />
    </Stack.Navigator>
  );
}

/**
 * Dashboard component
 *
 * @returns {React.ReactElement} The Dashboard component
 */
export type DashboardProps = {};

type DashboardFC = React.FC<DashboardProps>;

export default Dashboard as DashboardFC;
