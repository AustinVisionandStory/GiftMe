import { getApp, getApps, initializeApp } from "firebase/app";
import {
  type Auth,
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { Platform } from "react-native";

import { firebaseEnv } from "@/src/lib/firebase/env";

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        apiKey: firebaseEnv.apiKey,
        authDomain: firebaseEnv.authDomain,
        projectId: firebaseEnv.projectId,
        storageBucket: firebaseEnv.storageBucket,
        messagingSenderId: firebaseEnv.messagingSenderId,
        appId: firebaseEnv.appId,
      });

// Firebase v10+ automatically picks up AsyncStorage in React Native builds
// when the async-storage package is installed.
const auth: Auth = getAuth(app);

const db = getFirestore(app);
const functions = getFunctions(app, firebaseEnv.functionsRegion);
const storage = getStorage(app);

let emulatorsConnected = false;

function getEmulatorHost() {
  if (Platform.OS === "android" && firebaseEnv.emulatorHost === "127.0.0.1") {
    return "10.0.2.2";
  }

  return firebaseEnv.emulatorHost;
}

if (firebaseEnv.useEmulators && !emulatorsConnected) {
  const host = getEmulatorHost();

  connectAuthEmulator(auth, `http://${host}:9099`, {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, host, 8080);
  connectFunctionsEmulator(functions, host, 5001);
  connectStorageEmulator(storage, host, 9199);

  emulatorsConnected = true;
}

export { app, auth, db, functions, storage };
