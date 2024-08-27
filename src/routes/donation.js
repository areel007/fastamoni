import { Router } from "express";
import { makeDonation } from "../controllers/donation.js";
import { authenticateJWT } from "../middlewares/authenticate.user.js";

const router = Router();

router.route("/").post(authenticateJWT, makeDonation);

export default router;
