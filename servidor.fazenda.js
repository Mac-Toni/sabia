// servidor.fazenda.js
const express = require('express');
const path = require('path');
const db = require('./conexao.fazenda.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (CSS, JS, Imagens, HTMLs)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de Teste / Status da API
app.get('/api/status.fazenda', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS resultado');
        res.json({ status: 'online', db: 'conectado', teste: rows[0].resultado });
    } catch (error) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(` Servidor Fazenda Sabiá rodando na porta ${PORT}`);
});