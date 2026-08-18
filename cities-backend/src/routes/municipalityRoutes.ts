import express from "express";
import * as controller from "../controllers/municipalityController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
const router = express.Router();

router.get("/", controller.getMunicipalities);
router.get("/sum", controller.sumOfMunicipalities);
router.get("/:id", controller.getOneMunicipality);
router.post("/", authenticateToken, controller.postMunicipality);
router.put("/:id", authenticateToken, controller.updateMunicipality);
router.delete("/:id", authenticateToken, controller.deleteMunicipality);

export default router;
