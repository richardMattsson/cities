import express from "express";
import * as db from "../controllers/regionController.ts";
const router = express.Router();

router.get("/", db.getRegions);
router.get("/sum", db.sumOfRegions_controller);
router.get("/cities/:id", db.getCitiesFromRegion);
router.get("/:id", db.getOneRegionAPI);
router.post("/", db.postRegion);
router.put("/:id", db.updateRegion);
router.delete("/:id", db.deleteRegion);

export default router;
