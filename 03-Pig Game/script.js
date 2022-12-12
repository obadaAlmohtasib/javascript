"use strict";
//  Windows 10 + Dot   =>  To add Emoji
let activePlayer = 0;

const diceEl = document.querySelector(".dice");
const score0El = document.getElementById("score--0");
const score1El = document.getElementById("score--1");
const current0El = document.querySelector("#current--0");
const current1El = document.querySelector("#current--1");
diceEl.classList.add("hidden");
const scores = [0, 0];
let currentScore = 0;

const reset = function () {
    document.querySelector(".btn--roll").removeAttribute("disabled");
    document.querySelector(".btn--hold").removeAttribute("disabled");
    console.log("reset Triggered !");
    init();
};

const disableButtons = () => {
    document.querySelector(".btn--roll").setAttribute("disabled", true);
    document.querySelector(".btn--hold").setAttribute("disabled", true);
};

document.querySelector(".btn--roll").addEventListener("click", function () {
    // 1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. Display dice
    diceEl.classList.remove("hidden");
    diceEl.setAttribute("src", `dice-${dice}.png`); // diceEl.src = `dice-${dice}.png`;

    // 3. Check for rolled 1: if true, switch to next player
    // The player whose roll the one, lost all the current points.
    if (dice !== 1) {
        // Add dice to currenct score
        currentScore += dice;
        // console.log(document.querySelector(`#current--${activePlayer}`));
        document.querySelector(`#current--${activePlayer}`).textContent =
            currentScore;
    } else {
        // (dice === 1)
        currentScore = 0;
        switchPlayer();
    }
});

document.querySelector(".btn--hold").addEventListener("click", function () {
    // 1. Add current score to active player's score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
        scores[activePlayer];

    // 2. Check if player's score is >= 100
    if (scores[activePlayer] >= 100) {
        // Finish the game
        document
            .querySelector(`.player--${activePlayer}`)
            .classList.add("player--winner");
        disableButtons();
    } else {
        // Switch to the next player
        switchPlayer();
    }
});

function switchPlayer() {
    document.querySelector(".player--0").classList.toggle("player--active");
    document.querySelector(".player--1").classList.toggle("player--active");
    document.getElementById(`current--${activePlayer}`).textContent = 0;

    activePlayer = activePlayer === 0 ? 1 : 0;
    currentScore = 0;
}

document.querySelector(".btn--new").addEventListener("click", reset);

function init() {
    // Reset Player 1
    current0El.textContent = 0;
    score0El.textContent = 0;

    // Reset Player 2
    current1El.textContent = 0;
    score1El.textContent = 0;

    document.querySelector(".player--0").classList.add("player--active");
    document.querySelector(".player--1").classList.remove("player--active");
    document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--winner");

    activePlayer = true;

    currentScore = 0;
    activePlayer = 0;
    scores[0] = 0;
    scores[1] = 0;
    diceEl.classList.add("hidden");
}
