import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import citiesRoutes from "./routes/citiesRoutes.ts";
import regionRoutes from "./routes/regionRoutes.ts";
import cors from "cors";
import { HttpError } from "./errors/HttpError.ts";

const app = express();

const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (_request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/cities", citiesRoutes);
app.use("/regions", regionRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof Error ? err.message : String(err);
  res.status(status).json({ error: message });
});

app.listen(port, () => console.log(`App is running on port ${port}`));
