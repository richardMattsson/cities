import express from "express";
import * as controller from "../controllers/citiesController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
const router = express.Router();

router.get("/", controller.getCities);
router.get("/sum", controller.sumOfCities);
router.get("/:id", controller.getOneCity);
router.post("/", authenticateToken, controller.postCity);
router.put("/:id", authenticateToken, controller.updateCity);
router.delete("/:id", authenticateToken, controller.deleteCity);

export default router;
