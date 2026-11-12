// servidor.fazenda.js
require('dotenv').config({ path: '.fazenda.env' });
const db = require('./conexao.fazenda');

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota raiz redirecionando para a landing page com sufixo .fazenda
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.fazenda.html'));
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`[FAZENDA SABIÁ] Servidor rodando com sucesso na porta ${PORT}`);
    console.log(`[URL Local] http://localhost:${PORT}/landing.fazenda.html`);
});