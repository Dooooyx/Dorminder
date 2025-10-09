// App.js
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisternScreen';
import TenantDashboard from './src/screens/TenantDashboard';
import TenantRules from './src/screens/TenantRules';
import TenantRequests from './src/screens/TenantRequests';
import TenantPayment from './src/screens/TenantPayment';
import NewRequestForm from './src/screens/NewRequestForm';
import NewsScreen from './src/screens/NewsScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import ContactInfoScreen from './src/screens/ContactInfoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Newsreader-Regular': require('./src/assets/fonts/Newsreader-Regular.ttf'),
    'Newsreader-Bold': require('./src/assets/fonts/Newsreader-Bold.ttf'),
    'Newsreader-SemiBold': require('./src/assets/fonts/Newsreader-SemiBold.ttf'),
    'Newsreader-Medium': require('./src/assets/fonts/Newsreader-Medium.ttf'),
  });

  // If fonts fail to load after 3 seconds, continue anyway with system fonts
  const [forceRender, setForceRender] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!fontsLoaded && !forceRender) {
        console.warn('Fonts taking too long to load, using system fonts');
        setForceRender(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [fontsLoaded, forceRender]);

  if (!fontsLoaded && !fontError && !forceRender) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F5FA' }}>
        <ActivityIndicator size="large" color="#3D5A80" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Loading...</Text>
      </View>
    );
  }
  
  if (fontError) {
    console.warn('Font loading error:', fontError);
  }

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
        <Stack.Screen name="NewsScreen" component={NewsScreen} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="ContactInfoScreen" component={ContactInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
