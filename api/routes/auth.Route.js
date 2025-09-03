import express from "express";
import { signup, signin, google, createUserByAdmin } from "../controllers/auth.Controller.js";
import { verifyToken, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Público
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

// Apenas Admin pode criar user/customer
router.post("/create-user", verifyToken, verifyAdmin, createUserByAdmin);

export default router;
