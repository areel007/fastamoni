import { Router } from "express";
import {
  getDonation,
  getDonations,
  getDonationsWithinPeriods,
  makeDonation,
} from "../controllers/donation.js";
import { authenticateJWT } from "../middlewares/authenticate.user.js";

const router = Router();

router
  .route("/")
  .post(authenticateJWT, makeDonation)
  .get(authenticateJWT, getDonations);

router.route("/date-range").get(authenticateJWT, getDonationsWithinPeriods);

router.route("/:id").get(authenticateJWT, getDonation);

export default router;
