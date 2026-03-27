// Import the functions you need from the SDKs you need
import { env } from '#/env';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: env.VITE_FB_API_KEY,
  authDomain: env.VITE_FB_AUTH_DOMAIN,
  projectId: env.VITE_FB_PROJECT_ID,
  storageBucket: env.VITE_FB_STORE_BUCKET,
  messagingSenderId: env.VITE_FB_MESSAGING_SENDER_ID,
  appId: env.VITE_FB_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseDB = getFirestore(app);

console.log('PROJECT ID', env.VITE_FB_PROJECT_ID, env.VITE_FRAMEWORK_NAME);
