// ==========================================
// SCRIPT DE CADASTRO - SELNET
// Organizado para o trabalho da Unisuam
// ==========================================

// --- PEGANDO OS ELEMENTOS DO HTML ---
let campoNome = document.getElementById('inome');
let campoDataNascimento = document.getElementById('idata');
let campoNomeMaterno = document.getElementById('inome-materno');
let campoCpf = document.getElementById('icpf');
let campoEmail = document.getElementById('iemail');
let campoCelular = document.getElementById('itelcel');
let campoFixo = document.getElementById('itelfix');
let campoLogradouro = document.getElementById('ilogradouro');
let campoNumero = document.getElementById('inumero');
let campoComplemento = document.getElementById('icomplemento');
let campoBairro = document.getElementById('ibairro');
let campoCidade = document.getElementById('icidade');
let campoEstado = document.getElementById('iestado');
let campoCep = document.getElementById('icep');
let campoSenha = document.getElementById('isenha');
let campoConfirmarSenha = document.getElementById('iconfirmarSenha');
let textoErroSenha = document.getElementById('erroSenha');
let formularioCadastro = document.getElementById('form-cadastro');

// ==========================================
// 1. BUSCA DE ENDEREÇO PELO CEP (ViaCEP)
// ==========================================

// Máscara para o CEP (00000-000)
campoCep.addEventListener('input', function() {
    let v = campoCep.value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 5) v = v.substring(0, 5) + "-" + v.substring(5, 8);
    campoCep.value = v;
});

// Busca os dados quando o usuário sai do campo
campoCep.addEventListener('blur', function() {
    let cep = campoCep.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch('https://viacep.com.br/ws/' + cep + '/json/')
            .then(res => res.json())
            .then(dados => {
                if (dados.erro) {
                    alert('CEP não encontrado!');
                } else {
                    campoLogradouro.value = dados.logradouro || '';
                    campoBairro.value = dados.bairro || '';
                    campoCidade.value = dados.localidade || '';
                    campoEstado.value = dados.uf || '';
                    campoNumero.focus(); // Pula direto pro número da casa
                }
            });
    }
});

// ==========================================
// 2. VALIDAÇÕES DE DATA E NÚMERO
// ==========================================

// Trava de idade (Mínimo 18 anos e máximo realista)
let dataDeHoje = new Date();
let anoHoje = dataDeHoje.getFullYear();
let anoLimite = anoHoje - 18; 
let mesHoje = dataDeHoje.getMonth() + 1;
let diaHoje = dataDeHoje.getDate();

if (mesHoje < 10) mesHoje = '0' + mesHoje;
if (diaHoje < 10) diaHoje = '0' + diaHoje;

let dataFormatadaLimite = anoLimite + '-' + mesHoje + '-' + diaHoje;
campoDataNascimento.setAttribute('max', dataFormatadaLimite); // Não aceita menores de 18

// Trava para não aceitar anos muito antigos (ex: antes de 1920)
let anoMinimo = 1920;
let dataMinima = anoMinimo + '-01-01';
campoDataNascimento.setAttribute('min', dataMinima);

// Validação do número da casa: apenas números e no máximo 5 dígitos
campoNumero.addEventListener('input', function() {
    let v = campoNumero.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (v.length > 5) v = v.slice(0, 5); // Corta se passar de 5 dígitos
    campoNumero.value = v;
});

// ==========================================
// 3. VALIDAÇÃO DE NOMES E CPF
// ==========================================

function validarNomes() {
    let nU = campoNome.value.trim();
    let nM = campoNomeMaterno.value.trim();
    let apenasLetras = /^[a-zA-ZÀ-ÿ\s]+$/;

    if (nU !== "" && (!apenasLetras.test(nU) || nU.split(' ').length < 2)) {
        campoNome.setCustomValidity('Digite seu nome completo (apenas letras e espaços)!');
        return false;
    } else { campoNome.setCustomValidity(''); }

    if (nM !== "" && (!apenasLetras.test(nM) || nM.split(' ').length < 2)) {
        campoNomeMaterno.setCustomValidity('Digite o nome completo da mãe!');
        return false;
    } else { campoNomeMaterno.setCustomValidity(''); }

    return true;
}
campoNome.addEventListener('input', validarNomes);
campoNomeMaterno.addEventListener('input', validarNomes);

// Máscara do CPF (000.000.000-00)
campoCpf.addEventListener('input', function() {
    let v = campoCpf.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    let f = "";
    for (let i = 0; i < v.length; i++) {
        if (i === 3 || i === 6) f += ".";
        if (i === 9) f += "-";
        f += v[i];
    }
    campoCpf.value = f;
});

// Validação matemática do CPF
campoCpf.addEventListener('blur', function() {
    let cpf = campoCpf.value.replace(/\D/g, '');
    if (cpf === "" || cpf.length !== 11) return;

    let repetidos = true;
    for (let i = 1; i < 11; i++) { if (cpf[i] !== cpf[0]) repetidos = false; }
    if (repetidos) {
        campoCpf.setCustomValidity('CPF inválido!');
        campoCpf.reportValidity();
        return;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        campoCpf.setCustomValidity('CPF inválido!');
        campoCpf.reportValidity();
    } else {
        campoCpf.setCustomValidity('');
    }
});

// ==========================================
// 4. E-MAIL E TELEFONES
// ==========================================

let provedores = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'uol.com.br'];

campoEmail.addEventListener('blur', function() {
    let email = campoEmail.value.trim().toLowerCase();
    if (email === "") return;
    if (email.charAt(0) >= '0' && email.charAt(0) <= '9') {
        campoEmail.setCustomValidity('E-mail não pode começar com número!');
        campoEmail.reportValidity();
        return;
    }
    let dom = email.split('@')[1];
    if (!provedores.includes(dom)) {
        campoEmail.setCustomValidity('Use um provedor confiável!');
        campoEmail.reportValidity();
    } else { campoEmail.setCustomValidity(''); }
});

function aplicarMascaraTel(campo, tipo) {
    let v = campo.value.replace(/\D/g, '');
    let f = "";
    if (v.length > 0) f = "(" + v.substring(0, 2);
    if (v.length > 2) {
        if (tipo === 'cel') f += ") " + v.substring(2, 7) + "-" + v.substring(7, 11);
        else f += ") " + v.substring(2, 6) + "-" + v.substring(6, 10);
    }
    campo.value = f;
}
campoCelular.addEventListener('input', function() { aplicarMascaraTel(campoCelular, 'cel'); });
campoFixo.addEventListener('input', function() { aplicarMascaraTel(campoFixo, 'fix'); });

// Validação real de telefone e DDD
function validarTelReal(campo, tam) {
    let v = campo.value.replace(/\D/g, '');
    if (v === "") return;
    let ddd = parseInt(v.substring(0, 2));
    if (v.length < tam || ddd < 11) {
        campo.setCustomValidity('Telefone ou DDD inválido!');
        campo.reportValidity();
    } else { campo.setCustomValidity(''); }
}
campoCelular.addEventListener('blur', function() { validarTelReal(campoCelular, 11); });
campoFixo.addEventListener('blur', function() { validarTelReal(campoFixo, 10); });

// ==========================================
// 5. FINALIZAÇÃO E SALVAMENTO (LocalStorage)
// ==========================================

formularioCadastro.addEventListener('submit', function(e) {
    // Validações finais antes de salvar
    if (!validarNomes()) { e.preventDefault(); return; }

    if (campoNome.value.trim().toLowerCase() === campoNomeMaterno.value.trim().toLowerCase()) {
        if (!confirm('Seu nome é igual ao da sua mãe. Está correto?')) { e.preventDefault(); return; }
    }

    // Trava de senha: exatamente 8 caracteres
    let s = campoSenha.value;
    if (s.length !== 8) {
        e.preventDefault();
        textoErroSenha.textContent = 'A senha deve ter exatamente 8 caracteres!';
        campoSenha.focus();
        return;
    }

    // Trava de senha fraca
    let repetida = true;
    for(let i=1; i<8; i++) { if(s[i] !== s[0]) repetida = false; }
    if (s === "12345678" || repetida) {
        e.preventDefault();
        textoErroSenha.textContent = 'Senha muito fraca! Não use sequências ou números repetidos.';
        return;
    }

    if (s !== campoConfirmarSenha.value) {
        e.preventDefault();
        textoErroSenha.textContent = 'As senhas não conferem!';
        return;
    }

    // Se passou por tudo, limpa o texto de erro
    textoErroSenha.textContent = '';

    // Salvando os dados no LocalStorage para simular um banco de dados
    const dadosUsuario = {
        nome: campoNome.value,
        email: campoEmail.value,
        senha: campoSenha.value
    };

    // Uso o e-mail como chave única para cada cadastro
    localStorage.setItem(campoEmail.value, JSON.stringify(dadosUsuario));

    e.preventDefault(); // Impede o envio real para o redirecionamento funcionar
    alert('Cadastro realizado com sucesso! Agora você já pode fazer login.');
    
    // Redireciona para a página de login
    window.location.href = "../login/login.html";
});

// ==========================================
// 6. PAINEL DE ACESSIBILIDADE
// ==========================================

const btnAcesso = document.getElementById('btn-acessibilidade');
const painelOpcoes = document.getElementById('opcoes-acessibilidade');

btnAcesso.addEventListener('click', () => {
    if (painelOpcoes.style.display === 'none' || painelOpcoes.style.display === '') {
        painelOpcoes.style.display = 'block';
    } else {
        painelOpcoes.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#painel-acessibilidade')) {
        painelOpcoes.style.display = 'none';
    }
});

const tamanhos = [12, 14, 16, 18, 20, 22];
let indiceFonte = 2;

function aplicarFonte() {
    document.documentElement.style.setProperty('--tamanho-base', tamanhos[indiceFonte] + 'px');
}

document.getElementById('fonte-aumentar').addEventListener('click', () => {
    if (indiceFonte < tamanhos.length - 1) {
        indiceFonte++;
        aplicarFonte();
    }
});

document.getElementById('fonte-resetar').addEventListener('click', () => {
    indiceFonte = 2;
    aplicarFonte();
});

const btnContraste = document.getElementById('toggle-contraste');
btnContraste.addEventListener('click', () => {
    document.body.classList.toggle('alto-contraste');
});
