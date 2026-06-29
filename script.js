// ============================================
// MAPAS DE DADOS (Substituem if/else repetidos)
// ============================================

const CHOICE_EMOJI = {
    rock: '✊',
    paper: '✋',
    scissor: '✌️'
};

const WIN_CONDITIONS = {
    rock: 'scissor',      // rock vence scissor
    paper: 'rock',        // paper vence rock
    scissor: 'paper'      // scissor vence paper
};

// ============================================
// SELEÇÃO DO DOM (Segura para ambiente Node/Jest)
// ============================================

const getElement = (selector) => {
    if (typeof document !== 'undefined') {
        return document.querySelector(selector);
    }
    return null;
};

const getElements = (selector) => {
    if (typeof document !== 'undefined') {
        return document.querySelectorAll(selector);
    }
    return [];
};

const result = getElement('.result-message');
const playerScore = getElement('#player-score');
const cpuScore = getElement('#cpu-score');
const playerChoice = getElement('#player-choice');
const cpuChoice = getElement('#cpu-choice');
const resetGame = getElement('#btn-reset');
const battleArena = getElement('.battle-arena');
const currentYear = document.getElementById('currentYear');

// Elementos adicionais para animações, modos de jogo e labels
const btnModeCpu = getElement('#btn-mode-cpu');
const btnModePvp = getElement('#btn-mode-pvp');
const gameSubtitle = getElement('#game-subtitle');
const playerLabel = getElement('#player-label');
const cpuLabel = getElement('#cpu-label');
const playerColumnTitle = getElement('#player-column-title');
const cpuColumnTitle = getElement('#cpu-column-title');
const optionButtons = getElements('.option-btn');

// ============================================
// ESTADO CENTRALIZADO DO JOGO (Com localStorage)
// ============================================

const state = {
    mode: 'cpu', // 'cpu' ou 'pvp'
    cpu: {
        player: 0,
        cpu: 0,
        rounds: 0
    },
    pvp: {
        p1: 0,
        p2: 0,
        rounds: 0
    },
    p1Choice: null,
    currentTurn: 1, // 1 ou 2 (relevante no modo pvp)
    isAnimating: false
};

// Salvar estado no localStorage (Seguro para Node/Jest)
const saveToLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('jokenpo_state_v2', JSON.stringify(state));
    }
};

// Carregar estado do localStorage (com destructuring)
const loadFromLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('jokenpo_state_v2');
        if (saved) {
            try {
                const { cpu: savedCpu, pvp: savedPvp, mode: savedMode } = JSON.parse(saved);
                if (savedCpu) state.cpu = { ...state.cpu, ...savedCpu };
                if (savedPvp) state.pvp = { ...state.pvp, ...savedPvp };
                if (savedMode) state.mode = savedMode;
            } catch (e) {
                console.error("Erro ao carregar dados do localStorage", e);
            }
        }
    }
};

// ============================================
// FUNÇÃO: Gerar escolha aleatória da máquina
// ============================================

const playMachine = () => {
    const choices = ['rock', 'paper', 'scissor'];
    const randomNumber = Math.floor(Math.random() * choices.length);
    return choices[randomNumber];
};

// ============================================
// FUNÇÃO: Determinar vencedor (Lógica pura com destructuring)
// ============================================

const determineWinner = (p1, p2) => {
    if (p1 === p2) {
        return 'draw';
    }

    // Destructuring com computed property para simplificar
    const { [p1]: winsAgainst } = WIN_CONDITIONS;
    if (winsAgainst === p2) {
        return 'win'; // P1 ganha de P2
    }

    return 'lose'; // P1 perde de P2
};

// ============================================
// FUNÇÃO: Habilitar/Desabilitar botões
// ============================================

const toggleOptionButtons = (disabled) => {
    if (optionButtons && typeof optionButtons.forEach === 'function') {
        optionButtons.forEach(btn => btn.disabled = disabled);
    }
};

// ============================================
// FUNÇÃO: Limpar classes de efeitos de resultado
// ============================================

const clearResultEffects = () => {
    if (battleArena) {
        battleArena.classList.remove('player-winner-active', 'cpu-winner-active', 'draw-active');
    }
    if (result) {
        result.classList.remove('result-highlight-win', 'result-highlight-lose', 'result-highlight-draw');
    }
};

// ============================================
// FUNÇÃO: Aplicar classes de efeitos de resultado
// ============================================

const applyResultEffects = (resultType) => {
    clearResultEffects();
    const { mode } = state;

    if (battleArena && result) {
        if (resultType === 'win') {
            battleArena.classList.add('player-winner-active');
            result.classList.add('result-highlight-win');
            result.textContent = mode === 'pvp' ? 'Jogador 1 Ganhou!' : 'Você Ganhou!';
        } else if (resultType === 'lose') {
            battleArena.classList.add('cpu-winner-active');
            result.classList.add('result-highlight-lose');
            result.textContent = mode === 'pvp' ? 'Jogador 2 Ganhou!' : 'Você Perdeu!';
        } else {
            battleArena.classList.add('draw-active');
            result.classList.add('result-highlight-draw');
            result.textContent = 'Empate!';
        }
    }
};

// ============================================
// FUNÇÃO: Pontuação no DOM
// ============================================

const updateScoreDisplay = () => {
    // Destructuring para obter os valores de pontuação do estado
    const { mode, cpu, pvp } = state;

    if (mode === 'cpu') {
        const { player: cpuPlayerScore, cpu: cpuMachineScore } = cpu;
        if (playerScore) playerScore.textContent = cpuPlayerScore;
        if (cpuScore) cpuScore.textContent = cpuMachineScore;
    } else {
        const { p1: pvpP1Score, p2: pvpP2Score } = pvp;
        if (playerScore) playerScore.textContent = pvpP1Score;
        if (cpuScore) cpuScore.textContent = pvpP2Score;
    }
};

// ============================================
// FUNÇÃO: Atualizar interface dependendo do modo de jogo
// ============================================

const updateGameModeUI = () => {
    const { mode, currentTurn } = state;

    if (mode === 'cpu') {
        if (btnModeCpu) btnModeCpu.classList.add('active');
        if (btnModePvp) btnModePvp.classList.remove('active');
        if (gameSubtitle) gameSubtitle.textContent = 'Você contra a Inteligência Artificial';
        if (playerLabel) playerLabel.textContent = 'Você';
        if (cpuLabel) cpuLabel.textContent = 'CPU';
        if (playerColumnTitle) playerColumnTitle.textContent = 'Sua Jogada';
        if (cpuColumnTitle) cpuColumnTitle.textContent = 'CPU';
        if (result) result.textContent = 'Escolha uma opção para iniciar!';
    } else {
        if (btnModeCpu) btnModeCpu.classList.remove('active');
        if (btnModePvp) btnModePvp.classList.add('active');
        if (playerLabel) playerLabel.textContent = 'Jogador 1';
        if (cpuLabel) cpuLabel.textContent = 'Jogador 2';
        if (playerColumnTitle) playerColumnTitle.textContent = 'Jogada P1';
        if (cpuColumnTitle) cpuColumnTitle.textContent = 'Jogada P2';

        if (currentTurn === 1) {
            if (gameSubtitle) gameSubtitle.textContent = 'Jogador 1: Selecione seu movimento';
            if (result) result.textContent = 'Aguardando Jogador 1...';
        } else {
            if (gameSubtitle) gameSubtitle.textContent = 'Jogador 1 Escolheu! Jogador 2: Selecione seu movimento';
            if (result) result.textContent = 'Aguardando Jogador 2...';
        }
    }

    if (playerChoice) playerChoice.textContent = '❔';
    if (cpuChoice) cpuChoice.textContent = '❔';
    clearResultEffects();
    updateScoreDisplay();
};

// ============================================
// FUNÇÃO: Executar uma rodada contra a CPU (com animação)
// ============================================

const runRoundCpu = (playerSelection) => {
    state.isAnimating = true;
    toggleOptionButtons(true);
    clearResultEffects();

    // 1. Mostrar punhos de sacudida
    if (playerChoice) {
        playerChoice.textContent = '✊';
        playerChoice.classList.add('shake-left-animation');
    }
    if (cpuChoice) {
        cpuChoice.textContent = '✊';
        cpuChoice.classList.add('shake-right-animation');
    }
    if (result) result.textContent = 'Sacudindo...';

    const machineSelection = playMachine();

    // 2. Aguardar a animação terminar (500ms)
    setTimeout(() => {
        if (playerChoice) {
            playerChoice.classList.remove('shake-left-animation');
            playerChoice.textContent = CHOICE_EMOJI[playerSelection];
        }
        if (cpuChoice) {
            cpuChoice.classList.remove('shake-right-animation');
            cpuChoice.textContent = CHOICE_EMOJI[machineSelection];
        }

        // Determinar vencedor
        const resultType = determineWinner(playerSelection, machineSelection);

        // Atualizar estado
        if (resultType === 'win') {
            state.cpu.player++;
        } else if (resultType === 'lose') {
            state.cpu.cpu++;
        }
        state.cpu.rounds++;

        // Persistir e atualizar UI
        saveToLocalStorage();
        updateScoreDisplay();
        applyResultEffects(resultType);

        state.isAnimating = false;
        toggleOptionButtons(false);
    }, 500);
};

// ============================================
// FUNÇÃO: Executar rodada PvP local (2 Jogadores)
// ============================================

const runRoundPvp = (selection) => {
    if (state.currentTurn === 1) {
        // Jogador 1 faz sua jogada
        state.p1Choice = selection;
        state.currentTurn = 2;

        // Esconder escolha com um cadeado para o Jogador 2 não ver
        if (playerChoice) playerChoice.textContent = '🔒';
        if (cpuChoice) cpuChoice.textContent = '❔';

        if (gameSubtitle) gameSubtitle.textContent = 'Jogador 1 já escolheu! Jogador 2: Selecione seu movimento';
        if (result) result.textContent = 'Jogador 1 bloqueado. Vez do Jogador 2!';
    } else {
        // Jogador 2 faz sua jogada
        state.isAnimating = true;
        toggleOptionButtons(true);
        clearResultEffects();

        // Mostrar animação de sacudir
        if (playerChoice) {
            playerChoice.textContent = '✊';
            playerChoice.classList.add('shake-left-animation');
        }
        if (cpuChoice) {
            cpuChoice.textContent = '✊';
            cpuChoice.classList.add('shake-right-animation');
        }
        if (result) result.textContent = 'Sacudindo...';

        const p1Selection = state.p1Choice;
        const p2Selection = selection;

        setTimeout(() => {
            if (playerChoice) {
                playerChoice.classList.remove('shake-left-animation');
                playerChoice.textContent = CHOICE_EMOJI[p1Selection];
            }
            if (cpuChoice) {
                cpuChoice.classList.remove('shake-right-animation');
                cpuChoice.textContent = CHOICE_EMOJI[p2Selection];
            }

            // Determinar vencedor
            const resultType = determineWinner(p1Selection, p2Selection);

            // Atualizar estado
            if (resultType === 'win') {
                state.pvp.p1++;
            } else if (resultType === 'lose') {
                state.pvp.p2++;
            }
            state.pvp.rounds++;

            // Salvar e renderizar resultado
            saveToLocalStorage();
            updateScoreDisplay();
            applyResultEffects(resultType);

            // Preparar próxima rodada
            state.p1Choice = null;
            state.currentTurn = 1;
            state.isAnimating = false;
            toggleOptionButtons(false);

            // Restaurar texto de ajuda após um tempo
            setTimeout(() => {
                const { mode, isAnimating: stillAnimating } = state;
                if (mode === 'pvp' && !stillAnimating) {
                    if (gameSubtitle) gameSubtitle.textContent = 'Jogador 1: Selecione seu movimento';
                }
            }, 2500);
        }, 500);
    }
};

// ============================================
// FUNÇÃO: Jogador faz sua escolha
// ============================================

const playHuman = (myChoice) => {
    const { mode, isAnimating } = state;
    if (isAnimating) return;

    if (mode === 'cpu') {
        runRoundCpu(myChoice);
    } else {
        runRoundPvp(myChoice);
    }
};

// ============================================
// FUNÇÃO: Resetar o jogo
// ============================================

const resetGameFunction = () => {
    const { mode } = state;

    if (mode === 'cpu') {
        state.cpu = { player: 0, cpu: 0, rounds: 0 };
    } else {
        state.pvp = { p1: 0, p2: 0, rounds: 0 };
        state.p1Choice = null;
        state.currentTurn = 1;
    }

    saveToLocalStorage();
    clearResultEffects();
    updateGameModeUI();

    console.log(`Jogo resetado no modo: ${mode}!`);
};

// ============================================
// EVENT LISTENERS: Botões e Cliques
// ============================================

if (resetGame) {
    resetGame.addEventListener('click', resetGameFunction);
}

if (btnModeCpu) {
    btnModeCpu.addEventListener('click', () => {
        if (state.isAnimating || state.mode === 'cpu') return;
        state.mode = 'cpu';
        saveToLocalStorage();
        updateGameModeUI();
    });
}

if (btnModePvp) {
    btnModePvp.addEventListener('click', () => {
        if (state.isAnimating || state.mode === 'pvp') return;
        state.mode = 'pvp';
        state.p1Choice = null;
        state.currentTurn = 1;
        saveToLocalStorage();
        updateGameModeUI();
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

const init = () => {
    loadFromLocalStorage();
    updateGameModeUI();
    console.log('Jogo carregado! Use os controles da tela para jogar.');
};

// Executar inicialização se estiver no navegador
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', init);
}

// ============================================
// EXPORTAÇÃO PARA TESTES UNITÁRIOS (Jest / Node)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        determineWinner,
        playMachine,
        WIN_CONDITIONS,
        CHOICE_EMOJI,
        state
    };
}

// Atualizar ano dinâmico no rodapé
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}