import { deleteApp, getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import { connectFirestoreEmulator, doc, getDoc, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";

async function clearFirestore() {
  await fetch(
    "http://127.0.0.1:8080/emulator/v1/projects/demo-giftme/databases/(default)/documents",
    {
      method: "DELETE",
    },
  );
}

async function clearAuth() {
  await fetch("http://127.0.0.1:9099/emulator/v1/projects/demo-giftme/accounts", {
    method: "DELETE",
  });
}

function buildClientApp(name: string) {
  const existing = getApps().find((app) => app.name === name);

  if (existing) {
    return existing;
  }

  const app = initializeApp(
    {
      apiKey: "demo-api-key",
      appId: "demo-app-id",
      authDomain: "demo-giftme.firebaseapp.com",
      projectId: "demo-giftme",
      storageBucket: "demo-giftme.appspot.com",
      messagingSenderId: "demo-sender",
    },
    name,
  );

  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", {
    disableWarnings: true,
  });

  const db = getFirestore(app);
  connectFirestoreEmulator(db, "127.0.0.1", 8080);

  const functions = getFunctions(app, "us-central1");
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);

  return app;
}

beforeEach(async () => {
  await clearFirestore();
  await clearAuth();
});

afterEach(async () => {
  await Promise.all(getApps().map((app) => deleteApp(app)));
});

test("completeProfileSetup claims a username and creates user/profile docs", async () => {
  const app = buildClientApp("first-user");
  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, "us-central1");

  await createUserWithEmailAndPassword(auth, "alice@example.com", "password1!");

  const callable = httpsCallable(functions, "completeProfileSetup");
  await callable({
    username: "Alice",
    displayName: "Alice",
    bio: "Collector of good surprises.",
  });

  const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid));
  const profileDoc = await getDoc(doc(db, "profiles", auth.currentUser!.uid));
  const usernameDoc = await getDoc(doc(db, "usernames", "alice"));

  expect(userDoc.exists()).toBe(true);
  expect(profileDoc.exists()).toBe(true);
  expect(usernameDoc.exists()).toBe(true);
  expect(profileDoc.data()?.usernameLower).toBe("alice");
  expect(userDoc.data()?.onboardingComplete).toBe(true);
});

test("completeProfileSetup rejects duplicate usernames for another user", async () => {
  const firstApp = buildClientApp("owner");
  const firstAuth = getAuth(firstApp);
  const ownerFunctions = getFunctions(firstApp, "us-central1");

  await createUserWithEmailAndPassword(firstAuth, "owner@example.com", "password1!");
  const ownerCallable = httpsCallable(ownerFunctions, "completeProfileSetup");
  await ownerCallable({
    username: "sharedname",
    displayName: "Owner",
    bio: "",
  });

  await signOut(firstAuth);

  const secondApp = buildClientApp("second-user");
  const secondAuth = getAuth(secondApp);
  const secondFunctions = getFunctions(secondApp, "us-central1");

  await createUserWithEmailAndPassword(secondAuth, "other@example.com", "password1!");
  const secondCallable = httpsCallable(secondFunctions, "completeProfileSetup");

  await expect(
    secondCallable({
      username: "sharedname",
      displayName: "Other",
      bio: "",
    }),
  ).rejects.toMatchObject({
    code: "functions/already-exists",
  });
});
