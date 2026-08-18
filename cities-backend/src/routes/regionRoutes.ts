import express from "express";
import * as controller from "../controllers/regionController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
const router = express.Router();

router.get("/", controller.getRegions);
router.get("/sum", controller.sumOfRegions);
router.get("/cities/:id", controller.getCitiesFromRegion);
router.get("/:id", controller.getOneRegionAPI);
router.post("/", authenticateToken, controller.postRegion);
router.put("/:id", authenticateToken, controller.updateRegion);
router.delete("/:id", authenticateToken, controller.deleteRegion);

export default router;
