import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Errors,
  EventType,
  useZoom,
  ZoomVideoSdkUser,
  ZoomVideoSdkUserType,
} from '@zoom/react-native-videosdk';
import VideoView from '../../components/VideoView';
import {useIsMounted} from '../../hooks/useIsMounted';
import joinSession from '../../lib/zoom';
import {RootStackScreenProps} from '../../types/navigation';

const CallScreen = ({route}: RootStackScreenProps<'Call'>) => {
  const [users, setUsersInSession] = useState<ZoomVideoSdkUser[]>([]);
  const {user, sessionName} = route.params;

  const isMounted = useIsMounted();
  const zoom = useZoom();

  useEffect(() => {
    (async () => {
      await joinSession(zoom, user, sessionName);
    })();
  }, []);

  useEffect(() => {
    const sessionJoinListener = zoom.addListener(
      EventType.onSessionJoin,
      async (session: any) => {
        // zoom.session.getSessionName().then(setSessionName);
        const mySelf: ZoomVideoSdkUser = new ZoomVideoSdkUser(session.mySelf);
        const remoteUsers: ZoomVideoSdkUser[] =
          await zoom.session.getRemoteUsers();
        setUsersInSession([mySelf, ...remoteUsers]);
      },
    );

    const sessionLeaveListener = zoom.addListener(
      EventType.onSessionLeave,
      () => {
        setUsersInSession([]);
      },
    );

    const sessionNeedPasswordListener = zoom.addListener(
      EventType.onSessionNeedPassword,
      () => {
        Alert.alert('SessionNeedPassword');
      },
    );

    const sessionPasswordWrongListener = zoom.addListener(
      EventType.onSessionPasswordWrong,
      () => {
        Alert.alert('SessionPasswordWrong');
      },
    );

    const userJoinListener = zoom.addListener(
      EventType.onUserJoin,
      async ({remoteUsers}: {remoteUsers: ZoomVideoSdkUserType[]}) => {
        if (!isMounted()) return;
        const mySelf: ZoomVideoSdkUser = await zoom.session.getMySelf();
        const remote: ZoomVideoSdkUser[] = remoteUsers.map(
          (user: ZoomVideoSdkUserType) => new ZoomVideoSdkUser(user),
        );
        setUsersInSession([mySelf, ...remote]);
      },
    );

    const userLeaveListener = zoom.addListener(
      EventType.onUserLeave,
      async ({
        remoteUsers,
        leftUsers,
      }: {
        remoteUsers: ZoomVideoSdkUserType[];
        leftUsers: ZoomVideoSdkUserType[];
      }) => {
        if (!isMounted()) return;
        const mySelf: ZoomVideoSdkUser = await zoom.session.getMySelf();
        const remote: ZoomVideoSdkUser[] = remoteUsers.map(
          (user: ZoomVideoSdkUserType) => new ZoomVideoSdkUser(user),
        );
        setUsersInSession([mySelf, ...remote]);
      },
    );

    const commandReceived = zoom.addListener(
      EventType.onCommandReceived,
      (params: {sender: string; command: string}) => {
        console.log(
          'sender: ' + params.sender + ', command: ' + params.command,
        );
      },
    );

    const eventErrorListener = zoom.addListener(
      EventType.onError,
      async (error: any) => {
        console.log('Error: ' + JSON.stringify(error));
        switch (error.errorType) {
          case Errors.SessionJoinFailed:
            Alert.alert('Failed to join the session');
            // setTimeout(() => navigation.goBack(), 1000);
            break;
          default:
        }
      },
    );

    return () => {
      sessionJoinListener.remove();
      sessionLeaveListener.remove();
      sessionPasswordWrongListener.remove();
      sessionNeedPasswordListener.remove();
      userJoinListener.remove();
      userLeaveListener.remove();
      eventErrorListener.remove();
      commandReceived.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, users, isMounted]);

  return (
    <>
      <FlatList
        style={styles.userList}
        contentContainerStyle={styles.userListContentContainer}
        data={users}
        extraData={users}
        renderItem={({item}) => <VideoView user={item} key={item.userId} />}
        keyExtractor={item => item.userId}
        fadingEdgeLength={50}
        decelerationRate={0}
        snapToAlignment="center"
        snapToInterval={100}
        showsHorizontalScrollIndicator={false}
        horizontal
      />
    </>
  );
};

const styles = StyleSheet.create({
  userList: {
    width: '100%',
  },
  userListContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 90,
    height: 42,
    backgroundColor: 'darkblue',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  text: {
    color: 'white',
  },
});

export default CallScreen;
