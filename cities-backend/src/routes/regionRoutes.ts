import express from "express";
import * as db from "../controllers/regionController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
const router = express.Router();

router.get("/", db.getRegions);
router.get("/sum", db.sumOfRegions_controller);
router.get("/cities/:id", db.getCitiesFromRegion);
router.get("/:id", db.getOneRegionAPI);
router.post("/", authenticateToken, db.postRegion);
router.put("/:id", authenticateToken, db.updateRegion);
router.delete("/:id", authenticateToken, db.deleteRegion);

export default router;
