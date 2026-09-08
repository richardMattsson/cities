import express from "express";
import * as controller from "../controllers/citiesController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { body, param } from "express-validator";
const router = express.Router();

export const updateCityValidation = [
  param("id").trim().isInt({ min: 1 }).escape(),
  body("cities_name").trim().notEmpty(),
  body("cities_population").trim().isInt({ min: 0 }),
  body("municipality_id").trim().isInt({ min: 1 }),
];

router.get("/", controller.getCities);
router.get("/sum", controller.sumOfCities);
router.get("/:id", controller.getOneCity);
router.post("/", authenticateToken, controller.postCity);
router.put(
  "/:id",
  authenticateToken,
  updateCityValidation,
  controller.updateCity,
);
router.delete("/:id", authenticateToken, controller.deleteCity);

export default router;
