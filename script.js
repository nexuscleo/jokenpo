/*
const playerScore = document.getElementById('player-score');
const cpuScore = document.getElementById('cpu-score');
const playerChoice = document.getElementById('player-choice');
const cpuChoice = document.getElementById('cpu-choice');
const resultText = document.getElementById('result-text');
const gameContainer = document.querySelector('.game-container');
*/

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

}