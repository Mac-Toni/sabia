// servidor.fazenda.js
require('dotenv').config({ path: '.fazenda.env' });
const db = require('./conexao.fazenda');

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE MÍDIA
// ==========================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = path.join(__dirname, 'public');
        
        // Define a pasta de destino correta
        if (file.fieldname.startsWith('foto')) {
            uploadDir = path.join(uploadDir, 'animais');
        } else if (file.fieldname.startsWith('video')) {
            uploadDir = path.join(uploadDir, 'videos');
        }

        // Garante que o diretório existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Limite de 50MB para suportar vídeos
});

// Campos aceitos no upload do formulário admin
const cpUpload = upload.fields([
    { name: 'foto_1', maxCount: 1 },
    { name: 'foto_2', maxCount: 1 },
    { name: 'foto_3', maxCount: 1 },
    { name: 'foto_4', maxCount: 1 },
    { name: 'foto_5', maxCount: 1 },
    { name: 'video_arquivo', maxCount: 1 }
]);

// Rota raiz redirecionando para a landing page com sufixo .fazenda
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.fazenda.html'));
});

// ==========================================
// AUTENTICAÇÃO ADMINISTRATIVA (CPF + BCRYPT)
// ==========================================

app.post('/api/admin/login', async (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Informe o CPF e a senha.' });
    }

    const cpfLimpo = cpf.replace(/\D/g, '');

    try {
        const [rows] = await db.query(
            'SELECT * FROM administradores WHERE REPLACE(REPLACE(cpf, ".", ""), "-", "") = ?',
            [cpfLimpo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ sucesso: false, mensagem: 'CPF ou senha inválidos.' });
        }

        const admin = rows[0];
        const senhaValida = await bcrypt.compare(senha, admin.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ sucesso: false, mensagem: 'CPF ou senha inválidos.' });
        }

        res.json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
            usuario: { id: admin.id, nome: admin.nome }
        });
    } catch (erro) {
        console.error('Erro no login administrativo:', erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
    }
});

// Rota utilitária para registrar o primeiro admin com hash
app.post('/api/admin/registrar-inicial', async (req, res) => {
    const { nome, cpf, senha } = req.body;
    if (!nome || !cpf || !senha) {
        return res.status(400).json({ erro: 'Nome, CPF e senha são obrigatórios.' });
    }

    try {
        const cpfLimpo = cpf.replace(/\D/g, '');
        const senhaHash = await bcrypt.hash(senha, 10);

        await db.query(
            'INSERT INTO administradores (nome, cpf, senha_hash) VALUES (?, ?, ?)',
            [nome, cpfLimpo, senhaHash]
        );

        res.status(201).json({ sucesso: true, mensagem: 'Administrador cadastrado com hash seguro!' });
    } catch (erro) {
        console.error('Erro ao registrar admin:', erro);
        res.status(500).json({ erro: 'Erro ao cadastrar administrador.' });
    }
});

// ==========================================
// ROTAS DA API - GESTÃO DE ANIMAIS (CRUD)
// ==========================================

// 1. Listar todos os animais
app.get('/api/animais', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM animais ORDER BY id DESC');
        res.json(rows);
    } catch (erro) {
        console.error('Erro ao buscar animais:', erro);
        res.status(500).json({ erro: 'Erro interno ao carregar os animais.' });
    }
});

// 2. Listar apenas os animais à venda
app.get('/api/animais/venda', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM animais WHERE status_venda = TRUE ORDER BY id DESC');
        res.json(rows);
    } catch (erro) {
        console.error('Erro ao buscar animais à venda:', erro);
        res.status(500).json({ erro: 'Erro interno ao carregar os animais à venda.' });
    }
});

// 3. Buscar detalhes de um animal específico por ID
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

// 4. Cadastrar novo animal (com fallback exato para public/img/card.animais.venda.jpg)
app.post('/api/animais', cpUpload, async (req, res) => {
    const {
        nome, tatuagem, categoria, status_venda, preco,
        nascimento, pai, mae, premio, descricao
    } = req.body;

    try {
        const statusBool = status_venda === '1' || status_venda === true || status_venda === 1 ? 1 : 0;
        const precoValor = preco && Number(preco) > 0 ? Number(preco) : 0;
        const nascValor = nascimento && nascimento.trim() !== '' ? nascimento : null;

        // Caminho exato e direto para a imagem padrão na pasta public/img/
        const foto_1 = req.files && req.files['foto_1'] ? `/animais/${req.files['foto_1'][0].filename}` : '/img/card.animais.venda.jpg';
        const foto_2 = req.files && req.files['foto_2'] ? `/animais/${req.files['foto_2'][0].filename}` : null;
        const foto_3 = req.files && req.files['foto_3'] ? `/animais/${req.files['foto_3'][0].filename}` : null;
        const foto_4 = req.files && req.files['foto_4'] ? `/animais/${req.files['foto_4'][0].filename}` : null;
        const foto_5 = req.files && req.files['foto_5'] ? `/animais/${req.files['foto_5'][0].filename}` : null;
        const video_url = req.files && req.files['video_arquivo'] ? `/videos/${req.files['video_arquivo'][0].filename}` : null;

        const [result] = await db.query(
            `INSERT INTO animais 
            (nome, tatuagem, categoria, status_venda, preco, nascimento, pai, mae, premio, descricao, foto_1, foto_2, foto_3, foto_4, foto_5, video_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome, tatuagem, categoria, statusBool, precoValor,
                nascValor, pai || null, mae || null, premio || null, descricao || null,
                foto_1, foto_2, foto_3, foto_4, foto_5, video_url
            ]
        );

        res.status(201).json({ sucesso: true, id: result.insertId, mensagem: 'Animal cadastrado com sucesso!' });
    } catch (erro) {
        console.error('Erro ao cadastrar animal:', erro);
        res.status(500).json({ erro: 'Erro interno ao cadastrar o animal.' });
    }
});

// 5. Atualizar animal existente (com fallback exato para public/img/card.animais.venda.jpg)
app.put('/api/animais/:id', cpUpload, async (req, res) => {
    const { id } = req.params;
    const {
        nome, tatuagem, categoria, status_venda, preco,
        nascimento, pai, mae, premio, descricao
    } = req.body;

    try {
        const statusBool = status_venda === '1' || status_venda === true || status_venda === 1 ? 1 : 0;
        const precoValor = preco && Number(preco) > 0 ? Number(preco) : 0;
        const nascValor = nascimento && nascimento.trim() !== '' ? nascimento : null;

        const [rowsAntigas] = await db.query('SELECT * FROM animais WHERE id = ?', [id]);
        const atual = rowsAntigas[0] || {};

        // Se não houver foto nova e nem foto antiga cadastrada, assume /img/card.animais.venda.jpg
        const foto_1 = req.files && req.files['foto_1'] ? `/animais/${req.files['foto_1'][0].filename}` : (atual.foto_1 || '/img/card.animais.venda.jpg');
        const foto_2 = req.files && req.files['foto_2'] ? `/animais/${req.files['foto_2'][0].filename}` : (atual.foto_2 || null);
        const foto_3 = req.files && req.files['foto_3'] ? `/animais/${req.files['foto_3'][0].filename}` : (atual.foto_3 || null);
        const foto_4 = req.files && req.files['foto_4'] ? `/animais/${req.files['foto_4'][0].filename}` : (atual.foto_4 || null);
        const foto_5 = req.files && req.files['foto_5'] ? `/animais/${req.files['foto_5'][0].filename}` : (atual.foto_5 || null);
        const video_url = req.files && req.files['video_arquivo'] ? `/videos/${req.files['video_arquivo'][0].filename}` : (atual.video_url || null);

        await db.query(
            `UPDATE animais SET 
                nome = ?, tatuagem = ?, categoria = ?, status_venda = ?, preco = ?, 
                nascimento = ?, pai = ?, mae = ?, premio = ?, descricao = ?, 
                foto_1 = ?, foto_2 = ?, foto_3 = ?, foto_4 = ?, foto_5 = ?, video_url = ?
            WHERE id = ?`,
            [
                nome, tatuagem, categoria, statusBool, precoValor,
                nascValor, pai || null, mae || null, premio || null, descricao || null,
                foto_1, foto_2, foto_3, foto_4, foto_5, video_url,
                id
            ]
        );

        res.json({ sucesso: true, mensagem: 'Animal atualizado com sucesso!' });
    } catch (erro) {
        console.error('Erro ao atualizar animal:', erro);
        res.status(500).json({ erro: 'Erro interno ao atualizar o animal.' });
    }
});

// 6. Excluir animal
app.delete('/api/animais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM animais WHERE id = ?', [id]);
        res.json({ sucesso: true, mensagem: 'Animal excluído com sucesso!' });
    } catch (erro) {
        console.error('Erro ao excluir animal:', erro);
        res.status(500).json({ erro: 'Erro interno ao excluir o animal.' });
    }
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`[FAZENDA SABIÁ] Servidor rodando com sucesso na porta ${PORT}`);
    console.log(`[URL Local] http://localhost:${PORT}/landing.fazenda.html`);
});