import express from "express";
import citiesRoutes from "./routes/citiesRoutes.ts";
import municipalityRoutes from "./routes/municipalityRoutes.ts";
import regionRoutes from "./routes/regionRoutes.ts";
import dotenv from "dotenv";
import { initializeApp, cert } from "firebase-admin/app";
import { readFileSync } from "fs";
import { resolve } from "path";
import { errorHandler } from "./middleware/errorHandler.ts";

dotenv.config();

const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialPath) {
  throw new Error(
    "Missing GOOGLE_APPLICATION_CREDENTIALS. Add it to your .env file and point it to the Firebase service-account JSON file.",
  );
}

const fullPath = resolve(process.cwd(), credentialPath);

let serviceAccount: Record<string, unknown>;

try {
  serviceAccount = JSON.parse(readFileSync(fullPath, "utf8"));
} catch (error) {
  throw new Error(
    `Could not load Firebase credentials from "${fullPath}". Check that the file exists and contains valid JSON.`,
  );
}

initializeApp({
  credential: cert(serviceAccount),
});

const app = express();

const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/api/regions", regionRoutes);
app.use("/api/municipalities", municipalityRoutes);
app.use("/api/cities", citiesRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`App is running on port ${port}`));
