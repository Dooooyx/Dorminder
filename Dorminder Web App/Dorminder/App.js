// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisternScreen';
import TenantDashboard from './src/screens/TenantDashboard';
import TenantRules from './src/screens/TenantRules';
import TenantRequests from './src/screens/TenantRequests';
import TenantPayment from './src/screens/TenantPayment';
import NewRequestForm from './src/screens/NewRequestForm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="TenantDashboard" component={TenantDashboard} />
        <Stack.Screen name="TenantRules" component={TenantRules} />
        <Stack.Screen name="TenantRequests" component={TenantRequests} />
        <Stack.Screen name="TenantPayment" component={TenantPayment} />
        <Stack.Screen name="NewRequestForm" component={NewRequestForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
