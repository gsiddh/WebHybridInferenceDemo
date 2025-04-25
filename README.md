# WebHybridInferenceDemo

## Set Up

For client development:

1. run `npm install`
2. Populate src/firebase-config.js with config from Firebase console:

   ```ts
   export const firebaseConfig = {
     apiKey: "***",
     authDomain: "***",
     projectId: "***",
     storageBucket: "***",
     messagingSenderId: "***",
     appId: "***",
   };
   ```

For deployment to Hosting, install [Firebase CLI](https://firebase.google.com/docs/cli)

## Develop Client

Run local server: `npm run dev`

Preview deployable assets: `npm run preview`

## Deploy To Hosting

Run `npm run deploy`
