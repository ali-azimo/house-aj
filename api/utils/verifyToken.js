import jwt from "jsonwebtoken";
import { errorHandler } from "./erros.js";

export const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(errorHandler(401, "Usuário não autenticado!"));
    }

    // Garante que pega a chave secreta do .env
    if (!process.env.JWT_SECRET) {
      console.error("⚠️ JWT_SECRET não definido no .env!");
      return next(errorHandler(500, "Erro interno de configuração"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    next(errorHandler(403, "Token inválido ou expirado!"));
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, "Usuário não autenticado!"));
    if (req.user.role !== "admin") {
      return next(errorHandler(403, "Acesso negado: Admins apenas"));
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const isUserOrAdmin = (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, "Usuário não autenticado!"));
    next();
  } catch (err) {
    next(err);
  }
};
