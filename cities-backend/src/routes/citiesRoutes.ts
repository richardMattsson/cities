import express from "express";
import * as db from "../controllers/citiesController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
const router = express.Router();

router.get("/", db.getCities);
router.get("/sum", db.sumOfCities_controller);
router.get("/:id", db.getOneCity);
router.post("/", authenticateToken, db.postCity);
router.put("/:id", authenticateToken, db.updateCity);
router.delete("/:id", authenticateToken, db.deleteCity);

export default router;
