import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

type FirebaseCypressConfig = {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseTestEmail: string;
  firebaseTestPassword: string;
};

function getRequiredConfig(): FirebaseCypressConfig {
  const keys = ["firebaseApiKey", "firebaseAuthDomain", "firebaseProjectId", "firebaseTestEmail", "firebaseTestPassword"] as const;
  const config = Object.fromEntries(keys.map((key) => [key, Cypress.env(key)])) as Partial<FirebaseCypressConfig>;
  const missing = keys.filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(`Missing Cypress Firebase configuration: ${missing.join(", ")}. Copy cypress.env.example.json to cypress.env.json or set CYPRESS_* variables.`);
  }
  return config as FirebaseCypressConfig;
}

function getTestAuth() {
  const config = getRequiredConfig();
  const app = getApps().length ? getApp() : initializeApp({
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
  });
  return { auth: getAuth(app), config };
}

Cypress.Commands.add("loginByFirebase", () => {
  cy.then(() => {
    const { auth, config } = getTestAuth();
    return signInWithEmailAndPassword(auth, config.firebaseTestEmail, config.firebaseTestPassword);
  });
});

Cypress.Commands.add("getFirebaseIdToken", () => {
  return cy.then(() => {
    const { auth } = getTestAuth();
    if (!auth.currentUser) throw new Error("No Firebase user is signed in.");
    return auth.currentUser.getIdToken();
  });
});

declare global {
  // Cypress exposes its command registry through this ambient namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginByFirebase(): Chainable<void>;
      getFirebaseIdToken(): Chainable<string>;
    }
  }
}
