# MicroLink

MicroLink is a React + TypeScript + Vite frontend project with shadcn-ui and Tailwind CSS.

## Firebase setup

1. Copy `.env.example` to `.env`.
2. Fill all `VITE_FIREBASE_*` values with your Firebase project keys.
3. Enable Email/Password and Google/Apple sign-in providers in Firebase Auth console if you want to use those login options.

## Firestore rules

1. Install Firebase CLI if needed: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Select your project: `firebase use <your-project-id>`
4. Deploy rules from this repo:

```sh
firebase deploy --only firestore:rules
```

Rules file: `firestore.rules`

## Seed Firestore with dummy tasks, bids, and chats

1. Create a Firebase service account key JSON and save it locally (example: `serviceAccountKey.json` in repo root).
2. Set one of these env vars for the seed command:
   - `FIREBASE_SERVICE_ACCOUNT_PATH`
   - `GOOGLE_APPLICATION_CREDENTIALS`
3. Run:

```sh
npm run seed:firestore
```

The seed script inserts:
- user/helper profiles
- tasks (from previous dummy discovery data)
- bids (from previous dummy bidding data)
- conversations + messages (from previous dummy chat data)

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Test

```sh
npm test
```
