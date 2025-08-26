import mysql from 'mysql2/promise';

// Criar pool de conexões (melhor que uma única conexão)
export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'house',
  waitForConnections: true,
  connectionLimit: 10,   // máximo de conexões simultâneas
  queueLimit: 0
});

// Testar a conexão
db.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('❌ Conexão com MySQL perdida.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('❌ Muitas conexões no MySQL.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('❌ Conexão recusada. Verifique se o MySQL está a correr.');
    } else {
      console.error('❌ Erro desconhecido na conexão MySQL:', err);
    }
  }

  if (connection) {
    console.log('✅ Conectado ao MySQL com sucesso.');
    connection.release(); // liberar conexão para o pool
  }
});
export default db;