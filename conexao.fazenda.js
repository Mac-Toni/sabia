// conexao.fazenda.js
const mysql = require('mysql2/promise');

// Lê as configurações do arquivo .fazenda.env limpo
const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fazenda_sabia',
    port: parseInt(process.env.DB_PORT) || 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão ao iniciar
(async () => {
    try {
        const connection = await db.getConnection();
        console.log(`[BANCO DE DADOS] Conectado com sucesso na porta ${process.env.DB_PORT || 3307}!`);
        connection.release();
    } catch (error) {
        console.error(' Erro detalhado ao conectar no banco de dados:', error.message);
    }
})();

module.exports = db;