import {ZoomVideoSdkContext} from '@zoom/react-native-videosdk/lib/typescript/Context';
import {User} from '../../types/user';
import generateSignature from './generateSignature';

const joinSession = async (
  zoom: ZoomVideoSdkContext,
  user: User,
  sessionName: string,
) => {
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
