# WebHybridInferenceDemo

## Set Up

For client development:

1. Run `npm install`
2. Populate src/firebase-config.ts with config from Firebase console:

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

## Update SDK Version

1. Navigate to the [list of versions in NPM](https://www.npmjs.com/package/firebase?activeTab=versions)
2. Click through the version tagged `eap-vertexai-hybgoog`
3. Copy and run the install command, eg `npm i firebase@11.6.0-eap-vertexai-hybgoog.asd123`

## Deploy To Hosting

Run `npm run deploy`
