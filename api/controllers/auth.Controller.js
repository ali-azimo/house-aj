import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from "../db/db.Mysql.js";
import { errorHandler } from "../utils/erros.js";

// SIGNUP (público) - apenas user/customer
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, phone } = req.body; // não precisa de role do front

    if (!username || !email || !password || !phone) {
      return next(errorHandler(400, "Todos os campos são obrigatórios"));
    }

    // Verificar se já existe email
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return next(errorHandler(400, "Email já registado"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    // role sempre "user" para signup público
    const finalRole = "user";

    await db.query(
      "INSERT INTO users (username, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, finalRole, phone]
    );

    res.status(201).json({ message: "Conta criada com sucesso", role: finalRole });
  } catch (err) {
    next(err);
  }
};

// Apenas Admin pode criar user/customer
export const createUserByAdmin = async (req, res, next) => {
  try {
    const { username, email, password, role, phone } = req.body;

    if (!username || !email || !password || !role || !phone) {
      return next(errorHandler(400, "Todos os campos são obrigatórios"));
    }

    // Verificar se já existe email
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return next(errorHandler(400, "Email já registado"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    await db.query(
      "INSERT INTO users (username, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, role, phone]
    );

    res.status(201).json({ message: "Conta criada com sucesso", role });
  } catch (err) {
    next(err);
  }
};
// SIGNIN
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "Email e password são obrigatórios"));
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return next(errorHandler(404, "Utilizador não encontrado"));
    }

    const user = users[0];
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(400, "Credenciais inválidas"));
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie with token
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      user: userWithoutPassword,
      token
    });
  } catch (err) {
    console.error("Signin error:", err);
    next(errorHandler(500, "Erro interno do servidor"));
  }
};

// GOOGLE AUTH (sempre user)
export const google = async (req, res, next) => {
  try {
    const { email, username, avatar } = req.body;

    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    let newUser;
    if (user.length > 0) {
      newUser = user[0];
    } else {
      const randomPassword = bcryptjs.hashSync(Math.random().toString(36).slice(-8), 10);
      await db.query(
        "INSERT INTO users (username, email, password, avatar, role) VALUES (?, ?, ?, ?, ?)",
        [username, email, randomPassword, avatar, "user"]
      );

      const [createdUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      newUser = createdUser[0];
    }

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password, ...rest } = newUser;
    res.status(200).json({ token, user: rest });
  } catch (err) {
    next(err);
  }
};
