# GiftMe Foundation

GiftMe is an Expo + React Native mobile app backed by Firebase. This foundation includes:

- Firebase Auth with email/password, Apple Sign In, and Google Sign In hooks
- onboarding for unique usernames and public profiles
- public profile lookup by exact username
- Firestore, Storage, callable Functions, and emulator-backed backend tests

## Stack

- Expo Router + TypeScript
- Firebase JS SDK in the app
- Firebase Cloud Functions v2 for trusted mutations
- Firestore + Storage security rules
- Firebase Emulator Suite + Vitest for backend verification

## Local setup

1. Copy [`.env.example`](/Users/austinbuell/Documents/GitHub/GiftMe/.env.example) to `.env` and fill in your Firebase web app values.
2. Set up two Firebase projects and replace the aliases in [`.firebaserc`](/Users/austinbuell/Documents/GitHub/GiftMe/.firebaserc).
3. Enable Auth providers in Firebase Console:
   - Email/Password
   - Apple
   - Google
4. Add native Google files when you are ready to use Google Sign In:
   - `GoogleService-Info.plist`
   - `google-services.json`
5. Install dependencies from the repo root:
   - `npm install`

## Running the app

- `npm run start` starts Expo.
- `npm run dev` starts Expo for a development build.
- `npm run ios` and `npm run android` build native shells locally.

## Running Firebase locally

- `npm run emulators` builds the functions package and starts Auth, Firestore, Functions, Storage, and Emulator UI.
- `npm run test:backend` runs the emulator-backed rules and callable tests.

## Data model

- `users/{uid}` is private account state for the owner only.
- `profiles/{uid}` is the public profile document.
- `usernames/{usernameLower}` maps a normalized username to the owning `uid`.
- `avatars/{uid}/...` stores public profile avatars, writable only by the owner.

## OAuth notes

- Apple Sign In works on supported Apple devices.
- Google Sign In uses `@react-native-google-signin/google-signin`, so a development build or production build is required for the native flow.
- If Google native config is missing, the app keeps the Google button disabled instead of failing at startup.
