import db from "../db/db.Mysql.js";
import { errorHandler } from "../utils/erros.js";

/** Função utilitária para parsear imageUrls */
const parseImageUrls = (house) => {
  if (house.imageUrls && typeof house.imageUrls === "string") {
    try {
      house.imageUrls = JSON.parse(house.imageUrls);
    } catch (e) {
      console.error("Erro ao parsear imageUrls:", e);
      house.imageUrls = [];
    }
  }
  return house;
};

/** Criar nova casa */
export const createHouse = async (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, "Não autenticado"));

    const {
      name,
      descricao,
      address,
      regularPrice,
      discountPrice,
      bathroom,
      bedroom,
      kitchen,
      parking,
      type,
      offer,
      imageUrls
    } = req.body;

    // Validação campos obrigatórios
    if (!name || !descricao || !regularPrice || !bathroom || !bedroom || !kitchen || !type) {
      return next(errorHandler(400, "Todos os campos obrigatórios devem ser preenchidos"));
    }

    const cleanedData = {
      name,
      descricao,
      address: address || null,
      regularPrice: parseFloat(regularPrice),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      bathroom: parseInt(bathroom),
      bedroom: parseInt(bedroom),
      kitchen: parseInt(kitchen),
      parking: parking ? 1 : 0,
      type,
      offer: offer ? 1 : 0,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      userRef: req.user.id
    };

    if (cleanedData.offer && cleanedData.discountPrice >= cleanedData.regularPrice) {
      return next(errorHandler(400, "O preço com desconto deve ser menor que o preço regular"));
    }

    const [result] = await db.execute(
      `INSERT INTO cad_house 
        (name, descricao, address, regularPrice, discountPrice, bathroom, bedroom, kitchen, parking, type, offer, imageUrls, userRef, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        cleanedData.name,
        cleanedData.descricao,
        cleanedData.address,
        cleanedData.regularPrice,
        cleanedData.discountPrice,
        cleanedData.bathroom,
        cleanedData.bedroom,
        cleanedData.kitchen,
        cleanedData.parking,
        cleanedData.type,
        cleanedData.offer,
        JSON.stringify(cleanedData.imageUrls),
        cleanedData.userRef
      ]
    );

    res.status(201).json({ success: true, message: "Casa cadastrada com sucesso", houseId: result.insertId });

  } catch (error) {
    console.error("Erro ao criar casa:", error);
    next(errorHandler(500, "Erro interno do servidor ao criar casa"));
  }
};

/** Atualizar casa */
export const updateHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(`SELECT * FROM cad_house WHERE id = ?`, [id]);
    if (rows.length === 0) return next(errorHandler(404, "Casa não encontrada"));

    const house = rows[0];
    if (house.userRef !== req.user.id && req.user.role !== "admin") {
      return next(errorHandler(403, "Sem permissão para atualizar esta casa"));
    }

    const {
      name,
      descricao,
      address,
      regularPrice,
      discountPrice,
      bathroom,
      bedroom,
      kitchen,
      parking,
      type,
      offer,
      imageUrls
    } = req.body;

    const cleanedData = {
      name: name || house.name,
      descricao: descricao || house.descricao,
      address: address || house.address,
      regularPrice: regularPrice ? parseFloat(regularPrice) : house.regularPrice,
      discountPrice: discountPrice ? parseFloat(discountPrice) : house.discountPrice,
      bathroom: bathroom ? parseInt(bathroom) : house.bathroom,
      bedroom: bedroom ? parseInt(bedroom) : house.bedroom,
      kitchen: kitchen ? parseInt(kitchen) : house.kitchen,
      parking: parking !== undefined ? (parking ? 1 : 0) : house.parking,
      type: type || house.type,
      offer: offer !== undefined ? (offer ? 1 : 0) : house.offer,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : parseImageUrls(house).imageUrls
    };

    if (cleanedData.offer && cleanedData.discountPrice >= cleanedData.regularPrice) {
      return next(errorHandler(400, "O preço com desconto deve ser menor que o preço regular"));
    }

    await db.execute(
      `UPDATE cad_house 
       SET name=?, descricao=?, address=?, regularPrice=?, discountPrice=?, bathroom=?, bedroom=?, kitchen=?, parking=?, type=?, offer=?, imageUrls=?, updated_at=NOW()
       WHERE id=?`,
      [
        cleanedData.name,
        cleanedData.descricao,
        cleanedData.address,
        cleanedData.regularPrice,
        cleanedData.discountPrice,
        cleanedData.bathroom,
        cleanedData.bedroom,
        cleanedData.kitchen,
        cleanedData.parking,
        cleanedData.type,
        cleanedData.offer,
        JSON.stringify(cleanedData.imageUrls),
        id
      ]
    );

    res.json({ success: true, message: "Casa atualizada com sucesso" });

  } catch (error) {
    console.error("Erro ao atualizar casa:", error);
    next(errorHandler(500, "Erro interno do servidor ao atualizar casa"));
  }
};

/** Apagar casa */
export const deleteHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(`SELECT * FROM cad_house WHERE id = ?`, [id]);
    if (rows.length === 0) return next(errorHandler(404, "Casa não encontrada"));

    const house = rows[0];
    if (house.userRef !== req.user.id && req.user.role !== "admin") {
      return next(errorHandler(403, "Sem permissão para apagar esta casa"));
    }

    await db.execute(`DELETE FROM cad_house WHERE id = ?`, [id]);
    res.json({ success: true, message: "Casa eliminada com sucesso" });

  } catch (error) {
    console.error("Erro ao apagar casa:", error);
    next(errorHandler(500, "Erro interno do servidor ao apagar casa"));
  }
};

/** Obter casa por ID */
export const getHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(`SELECT * FROM cad_house WHERE id = ?`, [id]);
    if (rows.length === 0) return next(errorHandler(404, "Casa não encontrada"));

    const house = parseImageUrls(rows[0]);
    res.json({ success: true, data: house });

  } catch (error) {
    console.error("Erro ao buscar casa:", error);
    next(errorHandler(500, "Erro interno do servidor ao buscar casa"));
  }
};

/** Listar todas casas com filtros opcionais */
export const getHouses = async (req, res, next) => {
  try {
    const { offer, type, limit } = req.query;
    let query = "SELECT * FROM cad_house WHERE 1=1";
    const params = [];

    if (offer === "true") {
      query += " AND offer = ?";
      params.push(1);
    }

    if (type) {
      query += " AND type = ?";
      params.push(type);
    }

    query += " ORDER BY created_at DESC";

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit));
    }

    const [rows] = await db.execute(query, params);
    const houses = rows.map(parseImageUrls);
    res.json({ success: true, data: houses });

  } catch (error) {
    console.error("Erro ao listar casas:", error);
    next(errorHandler(500, "Erro interno do servidor ao listar casas"));
  }
};

/** Listar casas de um utilizador específico */
export const getUserHouses = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== parseInt(userId) && req.user.role !== "admin") {
      return next(errorHandler(403, "Sem permissão para ver estas casas"));
    }

    const [rows] = await db.execute(
      `SELECT * FROM cad_house WHERE userRef = ? ORDER BY created_at DESC`,
      [userId]
    );

    const houses = rows.map(parseImageUrls);
    res.json({ success: true, data: houses });

  } catch (error) {
    console.error("Erro ao buscar casas do usuário:", error);
    next(errorHandler(500, "Erro interno do servidor ao buscar casas do usuário"));
  }
};
