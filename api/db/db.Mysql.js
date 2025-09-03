import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'house',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso.');
    connection.release();
  } catch (err) {
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
})();

export default db;
