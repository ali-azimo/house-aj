import express from "express";
import { toggleLike, getLikesCount, checkUserLike } from "../controllers/like.Controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Alternar like (POST/DELETE)
router.post("/toggle", verifyToken, toggleLike);

// Contar likes
router.get("/count/:houseId", getLikesCount);

// Verificar se o utilizador deu like
router.get("/check/:houseId", verifyToken, checkUserLike);

export default router;
