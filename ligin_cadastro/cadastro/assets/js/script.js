// === Preenchimento automático por CEP (ViaCEP) ===
const inputCep = document.getElementById('icep');

// Busca o endereço automaticamente assim que o CEP tiver 8 dígitos
inputCep.addEventListener('input', async function () {
    // Remove tudo que não for número
    const cep = this.value.replace(/\D/g, '');

    // Só busca se tiver 8 dígitos
    if (cep.length !== 8) return;

    // Tenta buscar o CEP na API do ViaCEP
    // O "try/catch" captura erros de conexão (ex: sem internet)
    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        // Se o CEP não existir, marca o campo com erro
        if (dados.erro) {
            inputCep.closest('.campo-inner').style.borderBottomColor = '#ff4444';
            return;
        }

        // Limpa o erro e preenche os campos
        inputCep.closest('.campo-inner').style.borderBottomColor = '';
        document.getElementById('ilogradouro').value = dados.logradouro || '';
        document.getElementById('ibairro').value     = dados.bairro     || '';
        document.getElementById('icidade').value     = dados.localidade || '';
        document.getElementById('iestado').value     = dados.uf         || '';

        // Leva o cursor para o campo número
        document.getElementById('inumero').focus();

    } catch (erro) {
        console.error('Não foi possível buscar o CEP:', erro);
    }
});



// === Limites da data de nascimento ===
const campoData = document.getElementById('idata');

// Data máxima: hoje (não pode nascer no futuro)
const hoje = new Date();
const maxData = hoje.toISOString().split('T')[0];

// Data mínima: 120 anos atrás
const minData = new Date(hoje.getFullYear() - 120, hoje.getMonth(), hoje.getDate()).toISOString().split('T')[0];

campoData.setAttribute('max', maxData);
campoData.setAttribute('min', minData);

// === Validação Nome Completo e Nome Materno ===
// Verifica se o nome tem ao menos duas palavras (nome e sobrenome)
function validarNome(campo, mensagem) {
    campo.addEventListener('blur', function () {
        const palavras = this.value.trim().split(/\s+/);
        if (this.value.trim().length > 0 && palavras.length < 2) {
            this.setCustomValidity(mensagem);
            this.reportValidity();
        } else {
            this.setCustomValidity('');
        }
    });

    // Limpa o erro enquanto o usuário digita
    campo.addEventListener('input', function () {
        this.setCustomValidity('');
    });
}

validarNome(document.getElementById('inome'), 'Informe o nome completo (nome e sobrenome)');
validarNome(document.getElementById('inome-materno'), 'Informe o nome materno completo (nome e sobrenome)');

// === Máscara CPF (formato: 000.000.000-00) ===
const campoCpf = document.getElementById('icpf');

campoCpf.addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 11); // remove não-números, limita a 11 dígitos
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.value = valor;
    this.setCustomValidity(''); // limpa erro enquanto digita
});

// Valida se o CPF tem todos os 11 dígitos ao sair do campo
campoCpf.addEventListener('blur', function () {
    const digitos = this.value.replace(/\D/g, '');
    if (digitos.length > 0 && digitos.length < 11) {
        this.setCustomValidity('Informe um CPF válido com 11 dígitos: 000.000.000-00');
        this.reportValidity();
    } else {
        this.setCustomValidity('');
    }
});

// === Máscara CEP (formato: 00000-000) ===
document.getElementById('icep').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 8);
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    this.value = valor;
});

// === Máscara Celular (formato: (00) 00000-0000) ===
const campoCelular = document.getElementById('itelcel');

campoCelular.addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 11);
    valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
    valor = valor.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    this.value = valor;
});

// Valida se o celular tem todos os 11 dígitos ao sair do campo
campoCelular.addEventListener('blur', function () {
    const digits = this.value.replace(/\D/g, '');
    if (digits.length > 0 && digits.length < 11) {
        this.setCustomValidity('Informe um celular válido com DDD: (00) 00000-0000');
        this.reportValidity();
    } else {
        this.setCustomValidity('');
    }
});

// === Máscara Fixo (formato: (00) 0000-0000) ===
document.getElementById('itelfix').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 10);
    valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
    valor = valor.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    this.value = valor;
});

// === Validação de senha ===
const campoSenha = document.getElementById('isenha');
const campoConfirmar = document.getElementById('iconfirmarSenha');
const mensagemErro = document.getElementById('erroSenha');

// Verifica se as senhas coincidem e mostra/esconde a mensagem de erro
function validarSenha() {
    if (campoConfirmar.value && campoSenha.value !== campoConfirmar.value) {
        mensagemErro.style.display = 'block';
        return false;
    }
    mensagemErro.style.display = 'none';
    return true;
}

campoConfirmar.addEventListener('input', validarSenha);
campoSenha.addEventListener('input', validarSenha);

// Impede o envio do formulário se as senhas não coincidirem
document.getElementById('form-cadastro').addEventListener('submit', function (e) {
    if (!validarSenha()) {
        e.preventDefault(); // cancela o envio
    }
});

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
