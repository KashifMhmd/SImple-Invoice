import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Screens/Auth/Login/Login';
import ListView from '../Screens/Home/ListView/ListView';
import AddInovice from '../Screens/Home/AddInovice';
const Stack = createNativeStackNavigator();

const Navigations = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ListView" component={ListView} />
        <Stack.Screen name="AddInvoice" component={AddInovice} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigations;
