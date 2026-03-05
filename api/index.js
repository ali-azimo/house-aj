import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.Route.js";
import userRoutes from "./routes/user.Route.js";
import houseRoutes from "./routes/house.Route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import semRoutes from './routes/semelhante.Route.js';
import likeRoutes from "./routes/like.Route.js";

dotenv.config();

// 🔥 FORÇAR MODO PRODUÇÃO BASEADO NO .env 🔥
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Se a variável PORT existe, assumimos que é produção
if (process.env.PORT) {
  process.env.NODE_ENV = 'production';
}

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Configuração CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true
    : "http://localhost:5173",
  credentials: true,
}));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/houses", houseRoutes);
app.use('/api/similar', semRoutes);
app.use("/api/likes", likeRoutes);

// Configuração para servir o React (sempre ativa, mas verifica se os arquivos existem)
const frontendPath = path.join(__dirname, '../front/dist');
console.log('📁 Tentando servir arquivos de:', frontendPath);

// Serve arquivos estáticos se a pasta existir
import fs from 'fs';
if (fs.existsSync(frontendPath)) {
  console.log('✅ Pasta front/dist encontrada! Servindo arquivos estáticos...');
  app.use(express.static(frontendPath));
  
  // Todas as rotas não-API vão para o React
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      const indexPath = path.join(frontendPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.log('❌ index.html não encontrado em:', indexPath);
        res.status(404).send('Arquivo não encontrado. Execute npm run build primeiro.');
      }
    }
  });
} else {
  console.log('⚠️ Pasta front/dist não encontrada. Execute npm run build primeiro.');
}

// Middleware de erro
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno no servidor";
  res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
});