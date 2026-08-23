# Cypress E2E tests

The suite exercises the real browser flow and API. `POST`, `PUT`, and `DELETE` carry a Firebase ID token; Express verifies it with Firebase Admin before Drizzle writes to Postgres. Each mutation assertion checks its API response and then reads the affected city through the API, so it verifies persistence as well as the UI.

## Isolated test environment

Use a dedicated Firebase test project and a separate Postgres database. Never point `.env.e2e` at the normal development database or production.

Create the ignored local files from the templates:

```bash
cp .env.e2e.example .env.e2e
cp cities-frontend/.env.e2e.example cities-frontend/.env.e2e
cp cities-frontend/cypress.env.example.json cities-frontend/cypress.env.json
```

Create one dedicated email/password user in the Firebase test project and place those credentials only in `cities-frontend/cypress.env.json`. The values can instead be supplied as `CYPRESS_FIREBASE_API_KEY`, `CYPRESS_FIREBASE_AUTH_DOMAIN`, `CYPRESS_FIREBASE_PROJECT_ID`, `CYPRESS_FIREBASE_TEST_EMAIL`, and `CYPRESS_FIREBASE_TEST_PASSWORD`.

The backend service-account JSON must belong to the same Firebase test project. Initialise the empty `cities_e2e` database with the existing schema and seed it before testing; the city form needs at least one municipality:

```bash
cd cities-backend
npm run db:push:e2e
npm run db:seed:e2e
```

## Run locally

Start the isolated API in one terminal:

```bash
cd cities-backend
npm run start:e2e
```

Run the suite in another terminal. This starts Vite in E2E mode, waits for it, and stops it again when Cypress finishes:

```bash
cd cities-frontend
npm run e2e:run
```

For the interactive runner, start `npm run dev:e2e` in `cities-frontend`, then run `npm run cy:open` in another terminal.

Each test creates its own uniquely named city. `afterEach` removes a city left by a failed test; the delete test confirms removal itself. Do not run the suite against an environment that contains data you want to retain.
