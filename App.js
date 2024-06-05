import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TestFirestNotification from './Src/Notification/TestFirestNotification';
import Home from './Src/Notification/Home';
import Map from './Src/Notification/Map';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="TestFirestNotification"
          component={TestFirestNotification}
        />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
