import express from "express";
import * as controller from "../controllers/municipalityController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { validate } from "../middleware/validateInputMiddleware.ts";
import {
  deleteMunicipalityValidation,
  getCitiesFromMunicipalityValidation,
  getOneMunicipalityValidation,
  postMunicipalityValidation,
  updateMunicipalityValidation,
} from "../validation/municipalityValidation.ts";

const router = express.Router();

router.get("/", controller.getMunicipalities);
router.get("/sum", controller.sumOfMunicipalities);
router.get(
  "/cities/:id",
  validate(getCitiesFromMunicipalityValidation),
  controller.getCitiesFromMunicipality,
);
router.get(
  "/:id",
  validate(getOneMunicipalityValidation),
  controller.getOneMunicipality,
);
router.post(
  "/",
  authenticateToken,
  validate(postMunicipalityValidation),
  controller.postMunicipality,
);
router.put(
  "/:id",
  authenticateToken,
  validate(updateMunicipalityValidation),
  controller.updateMunicipality,
);
router.delete(
  "/:id",
  authenticateToken,
  validate(deleteMunicipalityValidation),
  controller.deleteMunicipality,
);

export default router;
