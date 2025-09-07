import express from "express";
import { verifyToken, isUserOrAdmin } from "../utils/verifyToken.js";
import {
  createHouse,
  getHouses,
  getHouse,
  updateHouse,
  deleteHouse,
  getUserHouses,
  searchHouses // <- Importar a nova função
} from "../controllers/house.Controller.js";

const router = express.Router();

// Criar imóvel (apenas user autenticado)
router.post("/create/", verifyToken, isUserOrAdmin, createHouse);

// Listar todos os imóveis com filtros (público)
router.get("/get", getHouses);

// Pesquisar imóveis avançado (público)
router.get("/search", searchHouses);

// Obter um imóvel específico por ID (público)
router.get("/get/:id", getHouse);

// Atualizar imóvel (apenas dono do imóvel ou admin)
router.put("/update/:id", verifyToken, isUserOrAdmin, updateHouse);

// Excluir imóvel (apenas dono ou admin)
router.delete("/delete/:id", verifyToken, isUserOrAdmin, deleteHouse);

// Listar imóveis de um utilizador específico (só o próprio ou admin)
router.get("/user/:userId", verifyToken, isUserOrAdmin, getUserHouses);

export default router;
