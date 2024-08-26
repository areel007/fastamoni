import { Router } from "express";
import {
  loginUser,
  registerUser,
  setTransactionPin,
} from "../controllers/user.js";
import { authenticateJWT } from "../middlewares/authenticate.user.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/set-transaction-pin").post(authenticateJWT, setTransactionPin);

export default router;
