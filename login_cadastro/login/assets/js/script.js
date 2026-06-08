// ==========================================
// SCRIPT DE LOGIN - SELNET
// Organizado para o trabalho da Unisuam
// ==========================================

// --- PEGANDO OS ELEMENTOS DO HTML ---
let campoEmail = document.getElementById('iemail');
let campoSenha = document.getElementById('isenha');
let formularioLogin = document.querySelector('form');

// ==========================================
// 1. VALIDAÇÃO E AUTENTICAÇÃO (LocalStorage)
// ==========================================

if (formularioLogin) {
    formularioLogin.addEventListener('submit', function(e) {
        let s = campoSenha.value;

        // Trava de segurança: exatamente 8 caracteres
        if (s.length !== 8) {
            e.preventDefault();
            alert('A senha deve ter exatamente 8 caracteres!');
            return;
        }
        
        // Trava de senha fraca (sequências ou repetidos)
        let seq = "12345678";
        let repetida = true;
        for(let i=1; i<8; i++) { 
            if(s[i] !== s[0]) repetida = false; 
        }
        
        if (s === seq || repetida) {
            e.preventDefault();
            alert('Acesso negado: Essa senha é muito fraca!');
            return;
        }

        // Busco os dados do usuário no localStorage usando o e-mail digitado
        const usuarioSalvo = localStorage.getItem(campoEmail.value);

        // Se não encontrar nada, significa que o e-mail não está no "banco"
        if (!usuarioSalvo) {
            e.preventDefault();
            alert('Você ainda não está cadastrado!');
            return;
        }

        // Transformo o texto de volta em objeto para conferir a senha
        const dados = JSON.parse(usuarioSalvo);

        if (dados.senha === s) {
            // Se a senha bater, eu salvo quem é o usuário logado no momento
            localStorage.setItem('usuarioLogado', dados.nome);
            
            e.preventDefault(); // Impede o envio real para o redirecionamento funcionar
            alert('Login realizado com sucesso! Bem-vindo(a), ' + dados.nome);
            
            // Redireciona para a página principal (Home)
            window.location.href = "../../telas/index.html";
        } else {
            e.preventDefault();
            alert('E-mail ou senha incorretos!');
        }
    });
}

// ==========================================
// 2. PAINEL DE ACESSIBILIDADE
// ==========================================

const btnAcesso = document.getElementById('btn-acessibilidade');
const painelOpcoes = document.getElementById('opcoes-acessibilidade');

// Abre ou fecha o painel ao clicar no botão
btnAcesso.addEventListener('click', () => {
    if (painelOpcoes.style.display === 'none' || painelOpcoes.style.display === '') {
        painelOpcoes.style.display = 'block';
    } else {
        painelOpcoes.style.display = 'none';
    }
});

// Fecha o painel ao clicar fora dele
document.addEventListener('click', (e) => {
    if (!e.target.closest('#painel-acessibilidade')) {
        painelOpcoes.style.display = 'none';
    }
});

// --- Ajuste de tamanho de fonte ---
const tamanhos = [12, 14, 16, 18, 20, 22];
let indiceFonte = 2; // 16px padrão

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

// --- Ativar Alto Contraste ---
const btnContraste = document.getElementById('toggle-contraste');
btnContraste.addEventListener('click', () => {
    document.body.classList.toggle('alto-contraste');
});
