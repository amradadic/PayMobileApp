import * as LocalAuthentication from "expo-local-authentication";
import { FINGERPRINT, FACEID } from "./constants";

export const getSupportedBioTypes = async () => {
  let authtypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (authtypes.length == 0) return null;
  const [fingerprint, faceId] = authtypes;
  return {
    [FINGERPRINT]: fingerprint ? true : false,
    [FACEID]: faceId ? true : false
  };
};

export const isBiometricsSupported = async () => {
  return await LocalAuthentication.isEnrolledAsync();
};
