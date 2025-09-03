// routes/user.routes.js
import express from "express";
import { 
  updateUser, 
  deleteUser, 
  signOut, 
  getUser, 
  getCad_house 
} from "../controllers/user.Controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// 🔐 todas as rotas precisam estar autenticadas
router.use(verifyToken);

// atualizar utilizador (user ou admin)
router.put("/:id", updateUser);

// eliminar utilizador (user ou admin)
router.delete("/:id", deleteUser);

// terminar sessão (limpa token no front)
router.post("/signout", signOut);

// obter dados de um utilizador (user ou admin)
router.get("/:id", getUser);

// obter imóveis cadastrados por um utilizador (user ou admin)
router.get("/:id/houses", getCad_house);

export default router;
