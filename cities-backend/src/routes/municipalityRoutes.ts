import express from "express";
import * as controller from "../controllers/municipalityController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { validate } from "../middleware/validateInputMiddleware.ts";
import {
  postMunicipalityValidation,
  updateMunicipalityValidation,
} from "../validation/municipalityValidation.ts";
const router = express.Router();

router.get("/", controller.getMunicipalities);
router.get("/sum", controller.sumOfMunicipalities);
router.get("/cities/:id", controller.getCitiesFromMunicipality);
router.get("/:id", controller.getOneMunicipality);
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
router.delete("/:id", authenticateToken, controller.deleteMunicipality);

export default router;
