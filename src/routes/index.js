import { Router } from "express";
import user from "./user.js";
import donation from "./donation.js";

const router = Router();

router.use("/api/auth", user);
router.use("/api/make-donation", donation);

export default router;
