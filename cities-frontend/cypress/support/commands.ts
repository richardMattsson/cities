import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

type FirebaseCypressConfig = {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseTestEmail: string;
  firebaseTestPassword: string;
};

function getRequiredConfig(): Cypress.Chainable<FirebaseCypressConfig> {
  const keys: Array<keyof FirebaseCypressConfig> = ["firebaseApiKey", "firebaseAuthDomain", "firebaseProjectId", "firebaseTestEmail", "firebaseTestPassword"];
  return cy.env(keys).then((config) => {
    const typedConfig = config as Partial<FirebaseCypressConfig>;
    const missing = keys.filter((key) => !typedConfig[key]);
    if (missing.length) {
      throw new Error(`Missing Cypress Firebase configuration: ${missing.join(", ")}. Copy cypress.env.example.json to cypress.env.json or set CYPRESS_* variables.`);
    }
    return typedConfig as FirebaseCypressConfig;
  });
}

function getTestAuth(config: FirebaseCypressConfig) {
  const app = getApps().length ? getApp() : initializeApp({
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
  });
  return { auth: getAuth(app), config };
}

Cypress.Commands.add("loginByFirebase", (): Cypress.Chainable<void> => {
  return getRequiredConfig().then((config) => {
    const { auth } = getTestAuth(config);
    return signInWithEmailAndPassword(auth, config.firebaseTestEmail, config.firebaseTestPassword).then(() => {});
  });
});

Cypress.Commands.add("getFirebaseIdToken", () => {
  return getRequiredConfig().then((config) => {
    const { auth } = getTestAuth(config);
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
