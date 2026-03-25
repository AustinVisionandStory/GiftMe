import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

async function seedDocuments() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "users/alice"), {
      uid: "alice",
      email: "alice@example.com",
      providers: ["password"],
      onboardingComplete: true,
      profileId: "alice",
      createdAt: "seeded",
      updatedAt: "seeded",
    });
    await setDoc(doc(context.firestore(), "profiles/alice"), {
      uid: "alice",
      username: "alice",
      usernameLower: "alice",
      displayName: "Alice",
      bio: "Profile seed",
      photoURL: null,
      createdAt: "seeded",
      updatedAt: "seeded",
    });
    await setDoc(doc(context.firestore(), "usernames/alice"), {
      uid: "alice",
      username: "alice",
      usernameLower: "alice",
      createdAt: "seeded",
    });
  });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-giftme",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync(resolve("firestore.rules"), "utf8"),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seedDocuments();
});

test("users documents are private to the owner", async () => {
  const alice = testEnv.authenticatedContext("alice").firestore();
  const bob = testEnv.authenticatedContext("bob").firestore();

  await assertSucceeds(getDoc(doc(alice, "users/alice")));
  await assertFails(getDoc(doc(bob, "users/alice")));
});

test("public profiles are readable without auth", async () => {
  const publicDb = testEnv.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(publicDb, "profiles/alice")));
});

test("usernames cannot be written by the client", async () => {
  const alice = testEnv.authenticatedContext("alice").firestore();
  await assertFails(
    setDoc(doc(alice, "usernames/newname"), {
      uid: "alice",
      username: "newname",
      usernameLower: "newname",
      createdAt: "now",
    }),
  );
});

test("profile owners can update editable fields but not username fields", async () => {
  const alice = testEnv.authenticatedContext("alice").firestore();

  await assertSucceeds(
    updateDoc(doc(alice, "profiles/alice"), {
      bio: "Fresh bio",
      updatedAt: "now",
    }),
  );

  await assertFails(
    updateDoc(doc(alice, "profiles/alice"), {
      usernameLower: "changed",
      updatedAt: "now",
    }),
  );
});
