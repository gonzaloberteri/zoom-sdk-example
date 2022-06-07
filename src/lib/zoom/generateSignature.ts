import {KJUR} from 'jsrsasign';
import Config from 'react-native-config';

const generateSignature = (
  sessionName: string,
  role: 0 | 1,
  sessionKey: string,
  userIdentity: string,
): string => {
  const iat = Math.round((new Date().getTime() - 30000) / 1000);
  const exp = iat + 60 * 60 * 2;
  const oHeader = {alg: 'HS256', typ: 'JWT'};

  const oPayload = {
    app_key: Config.SDK_KEY,
    tpc: sessionName,
    role_type: role,
    session_key: sessionKey,
    user_identity: userIdentity,
    iat: iat,
    exp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, Config.SDK_SECRET);
  return sdkJWT;
};

export default generateSignature;
