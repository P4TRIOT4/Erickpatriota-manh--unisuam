const btn = document.getElementById('toggle-tema');
        const root = document.documentElement;

        const icone = `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="white" stroke="#888888" stroke-width="1.5"/>
            <path d="M12 1 A11 11 0 0 0 12 23 Z" fill="#1A1A1A"/>
        </svg>`;

        const temaSalvo = localStorage.getItem('tema') || 'dark';
        aplicarTema(temaSalvo);

        btn.addEventListener('click', () => {
            const atual = root.getAttribute('data-tema');
            const novo = atual === 'dark' ? 'light' : 'dark';
            aplicarTema(novo);
            localStorage.setItem('tema', novo);
        });

        function aplicarTema(tema) {
            root.setAttribute('data-tema', tema);
            btn.innerHTML = icone;
            btn.title = tema === 'dark' ? 'Modo claro' : 'Modo escuro';
        }