// ===== PAINEL DE ACESSIBILIDADE =====

// Seleciona o botão e o painel de opções
const btnAcesso = document.getElementById('btn-acessibilidade');
const painelOpcoes = document.getElementById('opcoes-acessibilidade');

// Abre ou fecha o painel ao clicar no botão
btnAcesso.addEventListener('click', () => {
    if (painelOpcoes.hidden) {
        painelOpcoes.hidden = false;
        btnAcesso.setAttribute('aria-expanded', 'true');
    } else {
        painelOpcoes.hidden = true;
        btnAcesso.setAttribute('aria-expanded', 'false');
    }
});

// Fecha o painel ao clicar fora dele
document.addEventListener('click', (e) => {
    if (!e.target.closest('#painel-acessibilidade')) {
        painelOpcoes.hidden = true;
        btnAcesso.setAttribute('aria-expanded', 'false');
    }
});

// --- Ajuste de fonte ---
// Lista de tamanhos disponíveis em pixels
const tamanhos = [12, 14, 16, 18, 20, 22];
let indiceFonte = 2; // índice 2 = 16px (tamanho padrão)

// Aplica o tamanho de fonte atual e salva a preferência
function aplicarFonte() {
    document.documentElement.style.setProperty('--tamanho-base', tamanhos[indiceFonte] + 'px');
    localStorage.setItem('selnet-fonte', indiceFonte);
}

// Aumenta a fonte ao clicar em A+
document.getElementById('fonte-aumentar').addEventListener('click', () => {
    if (indiceFonte < tamanhos.length - 1) {
        indiceFonte++;
        aplicarFonte();
    }
});

// Reseta a fonte ao tamanho padrão (16px)
document.getElementById('fonte-resetar').addEventListener('click', () => {
    indiceFonte = 2;
    aplicarFonte();
});

// --- Alto contraste ---
const btnContraste = document.getElementById('toggle-contraste');

// Ativa ou desativa o alto contraste e salva a preferência
function aplicarContraste(ativo) {
    document.body.classList.toggle('alto-contraste', ativo);
    btnContraste.setAttribute('aria-pressed', String(ativo));

    if (ativo) {
        localStorage.setItem('selnet-contraste', '1');
    } else {
        localStorage.setItem('selnet-contraste', '0');
    }
}

// Alterna o contraste ao clicar no botão
btnContraste.addEventListener('click', () => {
    const contrasteAtivo = document.body.classList.contains('alto-contraste');
    aplicarContraste(!contrasteAtivo);
});

// --- Restaurar preferências salvas ---
// Ao carregar a página, verifica se o usuário tinha preferências salvas
function restaurarPreferencias() {
    // A fonte sempre inicia no tamanho padrão (16px)
    // Apenas o contraste é restaurado entre sessões
    const contrasteSalvo = localStorage.getItem('selnet-contraste');
    if (contrasteSalvo === '1') {
        aplicarContraste(true);
    }
}

restaurarPreferencias();
