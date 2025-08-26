import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();



import cookieParser from "cookie-parser";

// 🔹 Criar instância do Express
const app = express();

// 🔹 Configuração de middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "*", // Permite requisições do frontend
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 Rotas da API


// 🔹 Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor de contabilidade ativo 🚀");
});


// 🔹 Inicializar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
