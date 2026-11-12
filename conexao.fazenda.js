// conexao.fazenda.js
const mysql = require('mysql2/promise');

// Configuração da pool de conexões com o MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fazenda_sabia',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão ao iniciar
(async () => {
    try {
        const connection = await db.getConnection();
        console.log(' Conexão com o banco de dados MySQL realizada com sucesso!');
        connection.release();
    } catch (error) {
        console.error(' Erro ao conectar no banco de dados:', error.message);
    }
})();

module.exports = db;