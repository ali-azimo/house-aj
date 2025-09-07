import db from "../db/db.Mysql.js";
import { errorHandler } from "../utils/erros.js";

/** Normalizar tipo para inglês */
const normalizeType = (type) => {
  if (!type) return null;
  type = type.toLowerCase();
  if (type === "venda") return "sale";
  if (type === "renda") return "rent";
  return type;
};

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

/** Função utilitária para calcular tempo desde publicação */
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " ano(s) atrás";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " mês(es) atrás";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " dia(s) atrás";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hora(s) atrás";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minuto(s) atrás";
  return "Poucos segundos atrás";
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
      livingroom,   // novo
      parking,
      type,
      offer,
      available,    // novo
      imageUrls
    } = req.body;

    if (!name || !descricao || !regularPrice || !bathroom || !bedroom || !kitchen || !livingroom || !type) {
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
      livingroom: parseInt(livingroom), // novo
      parking: parking ? 1 : 0,
      type,
      offer: offer ? 1 : 0,
      available: available !== undefined ? (available ? 1 : 0) : 1, // novo
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      userRef: req.user.id
    };

    if (cleanedData.offer && cleanedData.discountPrice >= cleanedData.regularPrice) {
      return next(errorHandler(400, "O preço com desconto deve ser menor que o preço regular"));
    }

    const [result] = await db.execute(
      `INSERT INTO cad_house 
        (name, descricao, address, regularPrice, discountPrice, bathroom, bedroom, kitchen, livingroom, parking, type, offer, available, imageUrls, userRef, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        cleanedData.name,
        cleanedData.descricao,
        cleanedData.address,
        cleanedData.regularPrice,
        cleanedData.discountPrice,
        cleanedData.bathroom,
        cleanedData.bedroom,
        cleanedData.kitchen,
        cleanedData.livingroom,   // novo
        cleanedData.parking,
        cleanedData.type,
        cleanedData.offer,
        cleanedData.available,    // novo
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
    if (!req.user) return next(errorHandler(401, "Não autenticado"));

    const { id } = req.params;
    const [rows] = await db.execute(`SELECT * FROM cad_house WHERE id = ?`, [id]);
    if (rows.length === 0) return next(errorHandler(404, "Casa não encontrada"));

    const house = rows[0];
    if (parseInt(house.userRef) !== parseInt(req.user.id) && req.user.role !== "admin") {
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
      livingroom,  // novo
      parking,
      type,
      offer,
      available,   // novo
      imageUrls
    } = req.body;

    const cleanedData = {
      name: name || house.name,
      descricao: descricao || house.descricao,
      address: address || house.address,
      regularPrice: regularPrice != null ? parseFloat(regularPrice) : house.regularPrice,
      discountPrice: discountPrice != null ? parseFloat(discountPrice) : house.discountPrice,
      bathroom: bathroom != null ? parseInt(bathroom) : house.bathroom,
      bedroom: bedroom != null ? parseInt(bedroom) : house.bedroom,
      kitchen: kitchen != null ? parseInt(kitchen) : house.kitchen,
      livingroom: livingroom != null ? parseInt(livingroom) : house.livingroom, // novo
      parking: parking !== undefined ? (parking ? 1 : 0) : house.parking,
      type: type || house.type,
      offer: offer !== undefined ? (offer ? 1 : 0) : house.offer,
      available: available !== undefined ? (available ? 1 : 0) : house.available, // novo
      imageUrls: Array.isArray(imageUrls) 
        ? imageUrls 
        : (house.imageUrls ? parseImageUrls(house).imageUrls : [])
    };

    if (cleanedData.offer && cleanedData.discountPrice >= cleanedData.regularPrice) {
      return next(errorHandler(400, "O preço com desconto deve ser menor que o preço regular"));
    }

    await db.execute(
      `UPDATE cad_house 
       SET name=?, descricao=?, address=?, regularPrice=?, discountPrice=?, bathroom=?, bedroom=?, kitchen=?, livingroom=?, parking=?, type=?, offer=?, available=?, imageUrls=?, created_at=NOW()
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
        cleanedData.livingroom,  // novo
        cleanedData.parking,
        cleanedData.type,
        cleanedData.offer,
        cleanedData.available,   // novo
        JSON.stringify(cleanedData.imageUrls),
        id
      ]
    );

    res.json({ success: true, message: "Casa atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar casa:", error);
    return res.status(500).json({ success: false, message: error.message });
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

/** Listar todas casas com filtros opcionais */
export const getHouses = async (req, res, next) => {
  try {
    const { offer, type, available, limit } = req.query;
    let query = "SELECT * FROM cad_house WHERE 1=1";
    const params = [];

    if (offer === "true") {
      query += " AND offer = ?";
      params.push(1);
    }

    if (type) {
      const normalizedType = normalizeType(type);
      query += " AND type = ?";
      params.push(normalizedType);
    }

    if (available === "true") {
      query += " AND available = ?";
      params.push(1);
    }
    if (available === "false") {
      query += " AND available = ?";
      params.push(0);
    }

    query += " ORDER BY created_at DESC";

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit));
    }

    const [rows] = await db.execute(query, params);
    const houses = rows.map((house) => {
      const h = parseImageUrls(house);
      h.timeSince = timeSince(h.created_at);
      return h;
    });

    res.json({ success: true, data: houses });
  } catch (error) {
    console.error("Erro ao listar casas:", error);
    next(errorHandler(500, "Erro interno do servidor ao listar casas"));
  }
};

/** Obter casa por ID */
export const getHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(`SELECT * FROM cad_house WHERE id = ?`, [id]);
    if (rows.length === 0) return next(errorHandler(404, "Casa não encontrada"));

    const house = parseImageUrls(rows[0]);
    house.timeSince = timeSince(house.created_at);
    res.json({ success: true, data: house });
  } catch (error) {
    console.error("Erro ao buscar casa:", error);
    next(errorHandler(500, "Erro interno do servidor ao buscar casa"));
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

    const houses = rows.map((house) => {
      const h = parseImageUrls(house);
      h.timeSince = timeSince(h.created_at);
      return h;
    });

    res.json({ success: true, data: houses });
  } catch (error) {
    console.error("Erro ao buscar casas do usuário:", error);
    next(errorHandler(500, "Erro interno do servidor ao buscar casas do usuário"));
  }
};

/** Pesquisar casas com filtros avançados */
export const searchHouses = async (req, res, next) => {
  try {
    let {
      searchTerm = "",
      type = "all",
      parking = "all",
      offer = "all",
      available = "all",
      sort = "created_at",
      order = "desc",
      startIndex = 0,
      limit = 9
    } = req.query;

    startIndex = parseInt(startIndex);
    limit = parseInt(limit);

    let query = "SELECT * FROM cad_house WHERE 1=1";
    const params = [];

    // Pesquisa por nome ou descrição
    if (searchTerm) {
      query += " AND (name LIKE ? OR descricao LIKE ?)";
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    // Filtro por tipo
    if (type !== "all") {
      const normalizedType = normalizeType(type);
      if (normalizedType) {
        query += " AND type = ?";
        params.push(normalizedType);
      }
    }

    // Filtro por estacionamento
    if (parking === "true") query += " AND parking = 1";
    if (parking === "false") query += " AND parking = 0";

    // Filtro por oferta
    if (offer === "true") query += " AND offer = 1";
    if (offer === "false") query += " AND offer = 0";

    // Filtro por disponibilidade
    if (available === "true") query += " AND available = 1";
    if (available === "false") query += " AND available = 0";

    // Ordenação segura
    const allowedSort = ["created_at", "regularPrice"];
    const allowedOrder = ["asc", "desc"];
    if (!allowedSort.includes(sort)) sort = "created_at";
    if (!allowedOrder.includes(order.toLowerCase())) order = "desc";
    query += ` ORDER BY ${sort} ${order.toUpperCase()}`;

    // Paginação
    query += " LIMIT ? OFFSET ?";
    params.push(limit, startIndex);

    const [rows] = await db.execute(query, params);

    const houses = rows.map((house) => {
      const h = parseImageUrls(house);
      h.timeSince = timeSince(h.created_at);
      return h;
    });

    if (houses.length === 0) {
      return res.json({ success: true, data: [], message: "Nenhum resultado encontrado" });
    }

    res.json({ success: true, data: houses });
  } catch (error) {
    console.error("Erro ao pesquisar casas:", error);
    next(errorHandler(500, "Erro interno do servidor ao pesquisar casas"));
  }
};
