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
// SELEÇÃO DO DOM
// ============================================

const result = document.querySelector('.result-message');
const playerScore = document.querySelector('#player-score');
const cpuScore = document.querySelector('#cpu-score');
const playerChoice = document.querySelector('#player-choice');
const cpuChoice = document.querySelector('#cpu-choice');
const resetGame = document.querySelector('#btn-reset');

// ============================================
// ESTADO CENTRALIZADO DO JOGO
// ============================================

let humanScore = 0;
let machineScore = 0;
let roundsPlayed = 0;

// ============================================
// FUNÇÃO: Gerar escolha aleatória da máquina
// ============================================

const playMachine = () => {
    const choices = ['rock', 'paper', 'scissor'];
    const randomNumber = Math.floor(Math.random() * choices.length);
    return choices[randomNumber];
};

// ============================================
// FUNÇÃO: Determinar vencedor (Lógica pura)
// ============================================

const determineWinner = (human, machine) => {
    if (human === machine) {
        return 'draw';
    }

    if (WIN_CONDITIONS[human] === machine) {
        return 'win';
    }

    return 'lose';
};

// ============================================
// FUNÇÃO: Atualizar emoji (Sem repetição!)
// ============================================

const updateEmoji = (element, choice) => {
    element.textContent = CHOICE_EMOJI[choice];
};

// ============================================
// FUNÇÃO: Atualizar pontuação no DOM
// ============================================

const updateScoreDisplay = (resultType) => {
    if (resultType === 'win') {
        playerScore.textContent = humanScore;
    } else if (resultType === 'lose') {
        cpuScore.textContent = machineScore;
    }
};

// ============================================
// FUNÇÃO: Atualizar mensagem de resultado
// ============================================

const updateResultMessage = (resultType) => {
    if (resultType === 'draw') {
        result.textContent = 'Empate!';
    } else if (resultType === 'win') {
        result.textContent = 'Você ganhou!';
    } else {
        result.textContent = 'Você perdeu!';
    }
};

// ============================================
// FUNÇÃO: Atualizar pontos (Estado)
// ============================================

const updateScore = (resultType) => {
    if (resultType === 'win') {
        humanScore++;
    } else if (resultType === 'lose') {
        machineScore++;
    }
    roundsPlayed++;
};

// ============================================
// FUNÇÃO: Executar uma rodada completa
// ============================================

const playTheGame = (human, machine) => {
    // 1. Determinar vencedor
    const resultType = determineWinner(human, machine);

    // 2. Atualizar estado
    updateScore(resultType);

    // 3. Atualizar DOM - Emojis
    updateEmoji(playerChoice, human);
    updateEmoji(cpuChoice, machine);

    // 4. Atualizar DOM - Resultado
    updateResultMessage(resultType);
    updateScoreDisplay(resultType);

    // 5. Debug
    console.log(`Humano: ${human} | Máquina: ${machine} | Resultado: ${resultType}`);
};

// ============================================
// FUNÇÃO: Jogador faz sua escolha
// ============================================

const playHuman = (myChoice) => {
    const machineChoice = playMachine();
    playTheGame(myChoice, machineChoice);
};

// ============================================
// FUNÇÃO: Resetar o jogo
// ============================================

const resetGameFunction = () => {
    humanScore = 0;
    machineScore = 0;
    roundsPlayed = 0;

    playerScore.textContent = '0';
    cpuScore.textContent = '0';
    result.textContent = 'Escolha uma opção!';
    playerChoice.textContent = '?';
    cpuChoice.textContent = '?';

    console.log('Jogo resetado!');
};

// ============================================
// EVENT LISTENER - Botão Reset
// ============================================

if (resetGame) {
    resetGame.addEventListener('click', resetGameFunction);
}

// ============================================
// INICIALIZAÇÃO
// ============================================

console.log('Jogo carregado! Use: playHuman("rock"), playHuman("paper"), ou playHuman("scissor")');