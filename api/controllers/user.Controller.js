// controllers/user.controller.js
import db from "../db/db.Mysql.js";
import { errorHandler } from "../utils/erros.js";

// UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params; // ID do user a atualizar
    const { username, email } = req.body;

    // Apenas o próprio user ou admin pode atualizar
    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return next(errorHandler(403, "Não autorizado a atualizar este utilizador"));
    }

    await db.query(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, id]
    );

    res.status(200).json({ message: "Utilizador atualizado com sucesso" });
  } catch (err) {
    next(err);
  }
};

// DELETE USER
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return next(errorHandler(403, "Não autorizado a eliminar este utilizador"));
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).json({ message: "Utilizador eliminado com sucesso" });
  } catch (err) {
    next(err);
  }
};

// SIGN OUT
export const signOut = async (req, res, next) => {
  try {
    // frontend deve apagar o token do localStorage/cookies
    res.status(200).json({ message: "Sessão terminada com sucesso" });
  } catch (err) {
    next(err);
  }
};

// GET USER
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return next(errorHandler(403, "Não autorizado a ver este utilizador"));
    }

    const [user] = await db.query("SELECT id, username, email, role, avatar FROM users WHERE id = ?", [id]);

    if (user.length === 0) {
      return next(errorHandler(404, "Utilizador não encontrado"));
    }

    res.status(200).json(user[0]);
  } catch (err) {
    next(err);
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(errorHandler(403, "Apenas administradores podem ver todos os utilizadores"));
    }

    const [users] = await db.query("SELECT id, username, email, role, avatar, created_at FROM users");

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};
// GET CADASTROS DE CASAS (do próprio utilizador)
export const getCad_house = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Apenas o próprio user pode ver os seus imóveis, exceto admin
    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return next(errorHandler(403, "Não autorizado a ver imóveis deste utilizador"));
    }

    const [houses] = await db.query(
      "SELECT * FROM houses WHERE user_id = ?",
      [id]
    );

    res.status(200).json(houses);
  } catch (err) {
    next(err);
  }
};
