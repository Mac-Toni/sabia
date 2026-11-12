// componentes.fazenda.js
document.addEventListener("DOMContentLoaded", function() {
    // Inserir Navegação (Cabeçalho)
    const headerHTML = `
    <nav class="navbar-fazenda">
        <div class="logo-container">
            <img src="img/1.png" alt="Logo Fazenda Sabiá" class="logo-img">
            <div class="brand-title">
                FAZENDA SABIÁ
                <span>POLL DORSET | ACEGUÁ / RS</span>
            </div>
        </div>
        <ul class="nav-links">
            <li><a href="landing.fazenda.html" id="link-inicio">Início</a></li>
            <li><a href="animais.exposicao.fazenda.html" id="link-exposicao">Plantel Exposição</a></li>
            <li><a href="animais.venda.fazenda.html" id="link-venda">Animais à Venda</a></li>
            <li><a href="contato.fazenda.html" id="link-contato">Contato & Localização</a></li>
            <li><a href="login.fazenda.html" class="btn-dourado" style="padding: 5px 15px;">Painel Admin</a></li>
        </ul>
    </nav>
    `;

    // Inserir Rodapé Padronizado
    const footerHTML = `
    <footer>
        <p>&copy; 2026 Fazenda Sabiá - Aceguá / RS. Desenvolvido por Voxy Tec | Pixel Forge.</p>
    </footer>
    `;

    // Injeta no início e no fim do body se os elementos placeholders existirem ou cria automaticamente
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});