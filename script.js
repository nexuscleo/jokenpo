/*
const playerScore = document.getElementById('player-score');
const cpuScore = document.getElementById('cpu-score');
const playerChoice = document.getElementById('player-choice');
const cpuChoice = document.getElementById('cpu-choice');
const resultText = document.getElementById('result-text');
const gameContainer = document.querySelector('.game-container');
*/

const result = document.querySelector('.result');
const playerScore = document.querySelector('#player-score');
const cpuScore = document.querySelector('#cpu-score');
const playerChoice = document.querySelector('#player-choice');
const cpuChoice = document.querySelector('#cpu-choice');

// Variaveis Globais
let humanScore = 0;
let machineScore = 0;
let roundsPlayed = 0;

const playHuman = (myChoice) => {
    playTheGame(myChoice, playMachine())
};

const playMachine = () => {
    const choices = ['rock', 'paper', 'scissor']
    const randomNumber = Math.floor(Math.random() * 3)

    return choices[randomNumber]
}

const playTheGame = (human, machine) => {
    if (human === machine) {
        result.textContent = 'Empate!'
    }
    else if ((human === 'paper' && machine === 'rock') ||
        (human === 'rock' && machine === 'scissor') ||
        (human === 'scissor' && machine === 'paper')) {
        humanScore++;
        playerScore.textContent = humanScore;
        result.textContent = 'Você ganhou!'
    }
    else {
        machineScore++;
        cpuScore.textContent = machineScore;
        result.textContent = 'Você perdeu!'
    }
    
    playerChoice.textContent = human;
    cpuChoice.textContent = machine;
}