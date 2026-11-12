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

    // Inserir Rodapé Padronizado com Redes Sociais
    const footerHTML = `
    <footer>
        <p>&copy; 2026 Fazenda Sabiá - Aceguá / RS. Todos os direitos reservados.</p>
        <p style="margin-top: 8px; font-size: 0.9rem;">
            Acompanhe a criação: 
            <a href="https://www.facebook.com/people/Sabi%C3%A1-Poll-Dorset/100070547169421/" target="_blank" style="color: var(--dourado); text-decoration: none; margin: 0 10px;">Facebook</a> | 
            <a href="https://www.instagram.com/sabiapolldorset/" target="_blank" style="color: var(--dourado); text-decoration: none; margin: 0 10px;">Instagram</a> | 
            <a href="https://wa.me/5553999102289" target="_blank" style="color: var(--dourado); text-decoration: none; margin: 0 10px;">WhatsApp (53) 99910-2289</a>
        </p>
        <p style="margin-top: 8px; font-size: 0.8rem; color: #aaa;">Desenvolvido por Voxy Tec | Pixel Forge.</p>
    </footer>
    `;

    // Injeta no início e no fim do body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});