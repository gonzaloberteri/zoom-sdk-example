import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import CallScreen from './screens/Call';
import {RootStackParamList} from './types/navigation';
import {ZoomVideoSdkProvider} from '@zoom/react-native-videosdk';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => (
  <NavigationContainer>
    <ZoomVideoSdkProvider
      config={{
        // appGroupId: '{Your Apple Group ID here}',
        domain: 'zoom.us',
        enableLog: true,
      }}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Join session'}}
        />
        <Stack.Screen
          name="Call"
          component={CallScreen}
          options={{title: 'Call'}}
        />
      </Stack.Navigator>
    </ZoomVideoSdkProvider>
  </NavigationContainer>
);

export default App;
