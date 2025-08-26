// errorHandler.js
export const errorHandler = (statusCode = 500, message = "Erro interno do servidor") => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Middleware para capturar erros e enviar resposta JSON
export const handleErrorsMiddleware = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor";
  res.status(status).json({ error: message });
};
