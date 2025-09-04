import db from "../db/db.Mysql.js"; // conexão mysql2

export const getSimilarItems = async (req, res) => {
  try {
    const { type, id } = req.params;

    console.log("Buscando similares para:", type, id);

    // Busca o imóvel atual
    const [rows] = await db.query("SELECT * FROM cad_house WHERE id = ?", [id]);
    const current = rows[0];

    if (!current) {
      return res.status(404).json({ success: false, message: "Imóvel não encontrado" });
    }

    let query = "";
    let values = [];

    if (current.category) {
      // Se tem categoria, pega imóveis da mesma categoria
      query = "SELECT * FROM cad_house WHERE id != ? AND category = ? LIMIT 4";
      values = [id, current.category];
    } else if (current.type) {
      // Senão, pega pelo mesmo type
      query = "SELECT * FROM cad_house WHERE id != ? AND type = ? LIMIT 4";
      values = [id, current.type];
    } else {
      // Último fallback: por nº de quartos/banheiros
      query = "SELECT * FROM cad_house WHERE id != ? AND bedroom = ? AND bathroom = ? LIMIT 4";
      values = [id, current.bedroom, current.bathroom];
    }

    const [similares] = await db.query(query, values);

    // Normaliza imageUrls (vem como string JSON → vira array)
    const normalized = similares.map((item) => {
      let parsedImages = [];
      try {
        if (typeof item.imageUrls === "string") {
          parsedImages = JSON.parse(item.imageUrls);
        } else if (Array.isArray(item.imageUrls)) {
          parsedImages = item.imageUrls;
        }
      } catch (e) {
        console.warn("Erro ao parsear imageUrls:", e);
      }

      return {
        ...item,
        imageUrls: parsedImages,
      };
    });

    res.json(normalized);
  } catch (err) {
    console.error("Erro ao buscar similares:", err);
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
};