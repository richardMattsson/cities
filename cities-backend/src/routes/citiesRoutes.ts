import express from "express";
import * as controller from "../controllers/citiesController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { validate } from "../middleware/validateInputMiddleware.ts";
import {
  addCityValidation,
  cityQueryValidation,
  deleteCityValidation,
  getOneCityValidation,
  updateCityValidation,
} from "../validation/cityValidation.ts";
const router = express.Router();

router.get("/", validate(cityQueryValidation), (req, res, next) => {
  if (req.query.search) {
    return controller.searchCities(req, res, next);
  }

  return controller.getCities(req, res, next);
});

router.get("/sum", controller.sumOfCities);
router.get("/:id", validate(getOneCityValidation), controller.getOneCity);
router.post(
  "/",
  authenticateToken,
  validate(addCityValidation),
  controller.postCity,
);
router.put(
  "/:id",
  authenticateToken,
  validate(updateCityValidation),
  controller.updateCity,
);
router.delete(
  "/:id",
  authenticateToken,
  validate(deleteCityValidation),
  controller.deleteCity,
);

export default router;
