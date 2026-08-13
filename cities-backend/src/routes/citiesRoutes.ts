import express from "express";
import * as db from "../controllers/citiesController.ts";
const router = express.Router();

router.get("/", db.getCities);
router.get("/sum", db.sumOfCities_controller);
router.get("/:id", db.getOneCity);
router.post("/", db.postCity);
router.put("/:id", db.updateCity);
router.delete("/:id", db.deleteCity);

export default router;
