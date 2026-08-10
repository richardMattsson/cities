import express from "express";
import * as db from "../controllers/regionController.ts";
const router = express.Router();

router.get("/", db.getRegions);
router.get("/:id", db.getOneRegionAPI);
router.get("/cities/:id", db.getCitiesFromRegion);
router.post("/", db.postRegion);
router.put("/:id", db.updateRegion);
router.delete("/:id", db.deleteRegion);

export default router;
