import { initializeApp } from "firebase/app";
import { initializeUI } from "@firebase-oss/ui-core";
import { FirebaseUIProvider } from "@firebase-oss/ui-react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_firebaseApiKey,
  authDomain: import.meta.env.VITE_firebaseAuthDomain,
  projectId: import.meta.env.VITE_firebaseProjectId,
  storageBucket: import.meta.env.VITE_firebaseStorageBucket,
  messagingSenderId: import.meta.env.VITE_firebaseMessagingSenderId,
  appId: import.meta.env.VITE_firebaseAppId,
};

const app = initializeApp(firebaseConfig);

const ui = initializeUI({
  app,
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <FirebaseUIProvider ui={ui}>{children}</FirebaseUIProvider>;
}
