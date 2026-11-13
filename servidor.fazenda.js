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

// Servir arquivos estáticos da pasta public (incluindo imagens, vídeos e arquivos html)
app.use(express.static(path.join(__dirname, 'public')));

// Rota raiz redirecionando para a landing page com sufixo .fazenda
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.fazenda.html'));
});

// ==========================================
// ROTAS DA API - GESTÃO DE ANIMAIS (FAZENDA SABIÁ)
// ==========================================

// 1. Rota para listar todos os animais (plantel geral)
app.get('/api/animais', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM animais ORDER BY id DESC');
        res.json(rows);
    } catch (erro) {
        console.error('Erro ao buscar animais:', erro);
        res.status(500).json({ erro: 'Erro interno ao carregar os animais.' });
    }
});

// 2. Rota para listar apenas os animais à venda (usada em animais.venda.fazenda.html)
app.get('/api/animais/venda', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM animais WHERE status_venda = TRUE ORDER BY id DESC');
        res.json(rows);
    } catch (erro) {
        console.error('Erro ao buscar animais à venda:', erro);
        res.status(500).json({ erro: 'Erro interno ao carregar os animais à venda.' });
    }
});

// 3. Rota para buscar os detalhes de um animal específico por ID (usada em detalhe.fazenda.html)
app.get('/api/animais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM animais WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Animal não encontrado.' });
        }
        res.json(rows[0]);
    } catch (erro) {
        console.error('Erro ao buscar animal por ID:', erro);
        res.status(500).json({ erro: 'Erro interno ao buscar o animal.' });
    }
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`[FAZENDA SABIÁ] Servidor rodando com sucesso na porta ${PORT}`);
    console.log(`[URL Local] http://localhost:${PORT}/landing.fazenda.html`);
});