import jwt from "jsonwebtoken";
import { errorHandler } from "./erros.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];
    if (!token) return next(errorHandler(401, "Usuário não autenticado!"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreta123");
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    next(errorHandler(403, "Token inválido ou expirado!"));
  }
};
