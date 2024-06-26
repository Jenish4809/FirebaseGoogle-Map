import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TestFirestNotification from './Src/Notification/TestFirestNotification';
import Home from './Src/Notification/Home';
import Map from './Src/Notification/Map';
import RegisterUser from './Src/Notification/RegisterUser';
import UserDetails from './Src/Notification/UserDetails';
import DynamicLink from './Src/Notification/DynamicLink';
import ImageUpload from './Src/Notification/ImageUpload';

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
        <Stack.Screen name="RegisterUser" component={RegisterUser} />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen name="DynamicLink" component={DynamicLink} />
        <Stack.Screen name="ImageUpload" component={ImageUpload} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
