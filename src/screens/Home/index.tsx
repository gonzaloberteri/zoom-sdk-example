import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  checkMultiple,
  openSettings,
  Permission,
  PERMISSIONS,
  PermissionStatus,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {RootStackScreenProps} from '../../types/navigation';
import {Role} from '../../types/user';

const platformPermissions = {
  ios: [
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.MICROPHONE,
    //PERMISSIONS.IOS.PHOTO_LIBRARY,
  ],
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    //PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ],
};

const HomeScreen = ({navigation}: RootStackScreenProps<'Home'>) => {
  const [sessionName, setSessionName] = useState<string>('');
  const [role, setRole] = useState<Role>(Role.HOST);
  const [key, setKey] = useState<string>('');
  const [identity, setIdentity] = useState<string>('');

  const keyRef = useRef<TextInput>(null);
  const identityRef = useRef<TextInput>(null);

  const toggleRole = () => {
    setRole(role === Role.GUEST ? Role.HOST : Role.GUEST);
  };

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }

    const permissions = platformPermissions[Platform.OS];
    let blockedAny = false;
    let notGranted: Permission[] = [];

    checkMultiple(permissions).then(
      (statuses: Record<Permission[number], PermissionStatus>) => {
        permissions.map((p: Permission) => {
          const status = statuses[p];
          if (status === RESULTS.BLOCKED) {
            blockedAny = true;
          } else if (status !== RESULTS.GRANTED) {
            notGranted.push(p);
          }
        });
        notGranted.length && requestMultiple(notGranted);
        blockedAny && openSettings();
      },
    );
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <TextInput
            ref={keyRef}
            value={sessionName}
            onChangeText={text => setSessionName(text)}
            placeholder="Session name"
          />
          <View style={styles.component}>
            <Button
              onPress={toggleRole}
              title="HOST"
              color="darkblue"
              disabled={role === Role.HOST}
            />
            <Button
              onPress={toggleRole}
              title="GUEST"
              color="darkblue"
              disabled={role === Role.GUEST}
            />
          </View>
          <TextInput
            ref={keyRef}
            value={key}
            onChangeText={text => setKey(text)}
            placeholder="Key"
          />
          <TextInput
            ref={identityRef}
            value={identity}
            onChangeText={text => setIdentity(text)}
            placeholder="Identity"
          />
          <Button
            disabled={key === '' || identity === '' || sessionName === ''}
            title="Join"
            onPress={() =>
              navigation.navigate('Call', {
                user: {
                  key,
                  identity,
                  role,
                },
                sessionName,
              })
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  component: {
    flexDirection: 'row',
  },
});

export default HomeScreen;
