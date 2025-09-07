import db from "../db/db.Mysql.js";
import { errorHandler } from "../utils/erros.js";

// Alternar like (curtir/descurtir)
export const toggleLike = async (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, "Não autenticado"));

    const { houseId } = req.body;
    const userId = req.user.id;

    // Verificar se já deu like
    const [rows] = await db.execute(
      "SELECT * FROM likes WHERE user_id = ? AND house_id = ?",
      [userId, houseId]
    );

    if (rows.length > 0) {
      // Já existe → remover
      await db.execute("DELETE FROM likes WHERE user_id = ? AND house_id = ?", [
        userId,
        houseId,
      ]);
      return res.json({ success: true, liked: false });
    }

    // Se não existe → adicionar
    await db.execute("INSERT INTO likes (user_id, house_id) VALUES (?, ?)", [
      userId,
      houseId,
    ]);
    res.json({ success: true, liked: true });
  } catch (error) {
    console.error("Erro em toggleLike:", error);
    next(errorHandler(500, "Erro ao processar like"));
  }
};

// Contar likes de uma casa
export const getLikesCount = async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM likes WHERE house_id = ?",
      [houseId]
    );
    res.json({ success: true, houseId, likes: rows[0].total });
  } catch (error) {
    console.error("Erro em getLikesCount:", error);
    next(errorHandler(500, "Erro ao contar likes"));
  }
};

// Verificar se o utilizador já deu like numa casa
export const checkUserLike = async (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, "Não autenticado"));
    const { houseId } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM likes WHERE user_id = ? AND house_id = ?",
      [req.user.id, houseId]
    );
    res.json({ success: true, liked: rows.length > 0 });
  } catch (error) {
    console.error("Erro em checkUserLike:", error);
    next(errorHandler(500, "Erro ao verificar like do utilizador"));
  }
};
