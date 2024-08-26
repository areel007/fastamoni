import { Router } from "express";
import user from "./user.js";

const router = Router();

router.use("/api/auth", user);

export default router;
