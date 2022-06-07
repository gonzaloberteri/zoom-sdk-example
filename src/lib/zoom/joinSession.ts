import { ZoomVideoSdkContext } from '@zoom/react-native-videosdk/lib/typescript/Context';
import generateSignature from './generateSignature';

export interface User {
  role: 0 | 1;
  key: string;
  identity: string;
}

const joinSession = async (zoom: ZoomVideoSdkContext, user: User, sessionName: string) => {
  const token = await generateSignature(
    sessionName,
    user.role,
    user.key,
    user.identity,
  );

  try {
    await zoom.joinSession({
      sessionName: sessionName,
      token,
      userName: user.identity,
      audioOptions: {
        connect: true,
        mute: false,
      },
      videoOptions: {
        localVideoOn: true,
      },
      sessionIdleTimeoutMins: 40,
    });
  } catch (e) {
    console.log('Failed to join the session');
  }
};
export default joinSession;
