import express from "express";
import * as controller from "../controllers/regionController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { validate } from "../middleware/validateInputMiddleware.ts";
import {
  postRegionValidation,
  updateRegionValidation,
} from "../validation/regionValidation.ts";
const router = express.Router();

router.get("/", controller.getRegions);
router.get("/sum", controller.sumOfRegions);
router.get("/municipalities/:id", controller.getMunicipalitiesFromRegion);
router.get("/:id", controller.getOneRegionAPI);
router.post(
  "/",
  authenticateToken,
  validate(postRegionValidation),
  controller.postRegion,
);
router.put(
  "/:id",
  authenticateToken,
  validate(updateRegionValidation),
  controller.updateRegion,
);
router.delete("/:id", authenticateToken, controller.deleteRegion);

export default router;
