import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.Route.js";
import userRoutes from "./routes/user.Route.js";
import houseRoutes from "./routes/house.Route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import semRoutes from './routes/semelhante.Route.js';
import likeRoutes from "./routes/like.Route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/houses", houseRoutes); // Supondo que as rotas de imóveis estão em userRoutes, ajuste conforme necessário
app.use('/api/similar', semRoutes);
app.use("/api/likes", likeRoutes);

// Middleware de erro
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno no servidor";
  res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));