import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Importações das suas rotas
import authRoutes from "./routes/auth.Route.js";
import userRoutes from "./routes/user.Route.js";
import houseRoutes from "./routes/house.Route.js";
import semRoutes from './routes/semelhante.Route.js';
import likeRoutes from "./routes/like.Route.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// MIDDLEWARES
// ============================================

app.use(express.json());
app.use(cookieParser());

// Configuração CORS - Funciona em desenvolvimento e produção
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://lichinga-home.com', 'https://www.lichinga-home.com']
    : ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middleware de LOG (útil para debug)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware de TIMEOUT (evita erro 503)
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    console.log(`⏰ Timeout: ${req.method} ${req.url}`);
    res.status(503).json({ 
      error: 'Service Unavailable', 
      message: 'A requisição demorou muito tempo. Tente novamente.' 
    });
  });
  next();
});

// ============================================
// ROTAS DA API
// ============================================

// Rota de teste para verificar se API está no ar
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'API funcionando perfeitamente!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Suas rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/houses", houseRoutes);
app.use('/api/similar', semRoutes);
app.use("/api/likes", likeRoutes);

// ============================================
// SERVIÇO DO FRONTEND (REACT)
// ============================================

// Caminho para os arquivos do React (após o build)
const frontendPath = path.join(__dirname, '../front/dist');
console.log(`📁 Procurando arquivos do React em: ${frontendPath}`);

// Verifica se a pasta do React existe
if (fs.existsSync(frontendPath)) {
  console.log('✅ Pasta do React encontrada!');
  
  // Lista os arquivos para debug
  const files = fs.readdirSync(frontendPath);
  console.log('📄 Arquivos na pasta dist:', files);
  
  // Serve todos os arquivos estáticos (CSS, JS, imagens)
  app.use(express.static(frontendPath));
  
  // Rota principal - serve o React
  app.get('/', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('index.html não encontrado. Execute npm run build primeiro.');
    }
  });
  
  // Rota curinga - qualquer rota que não seja API vai para o React
  app.get('*', (req, res) => {
    // Ignora requisições para a API
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // Verifica se o arquivo solicitado existe (ex: imagem, css, js)
    const filePath = path.join(frontendPath, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
    
    // Se não for um arquivo, envia o index.html (React Router)
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Página não encontrada');
    }
  });
  
} else {
  console.log('❌ Pasta do React NÃO encontrada!');
  console.log('👉 Execute "npm run build" na raiz do projeto para gerar os arquivos.');
  
  // Rota temporária enquanto o React não está pronto
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Lichinga Home</title>
          <style>
            body { font-family: Arial; padding: 40px; text-align: center; }
            .info { background: #f0f0f0; padding: 20px; border-radius: 10px; }
          </style>
        </head>
        <body>
          <h1>🏠 Lichinga Home</h1>
          <div class="info">
            <h2>Servidor rodando!</h2>
            <p>✅ API está funcionando: <a href="/api/status">/api/status</a></p>
            <p>⚠️ Frontend React não encontrado.</p>
            <p>Execute no terminal:</p>
            <code>cd F:\Web\house-aj && npm run build</code>
          </div>
        </body>
      </html>
    `);
  });
}

// ============================================
// MIDDLEWARE DE ERRO GLOBAL
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno no servidor";
  
  res.status(statusCode).json({ 
    success: false, 
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔍 Teste API: http://localhost:${PORT}/api/status`);
  console.log('='.repeat(50));
});