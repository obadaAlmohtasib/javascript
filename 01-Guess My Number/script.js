"use strict";
//  Windows 10 + Dot   =>  To add Emoji
let secretNumber = Math.trunc(Math.random() * 1000) + 1;

// Input
const input = document.querySelector(".guess");

// Dynamic Texts
const scoreHolder = document.querySelector(".score");
const highscoreHolder = document.querySelector(".highscore");
const message = document.querySelector(".message");
const divNumber = document.querySelector(".number");

// Trigger action-button
document
    .getElementsByClassName("again")[0]
    .addEventListener("click", function () {
        scoreHolder.innerText = 20;
        secretNumber = Math.trunc(Math.random() * 1000) + 1;
        message.textContent = "Start guessing...";
        input.value = "";
        document.body.style.backgroundColor = "#222";
        divNumber.textContent = "?";
    });

document.querySelector(".check").addEventListener("click", () => {
    let val = Number(input.value);
    if (!val) {
        // Empty value = 0;
        // !0  >  since 0 is a falsy value.
        message.textContent = "⛔ No number!";
        return;
    }

    let score = Number(scoreHolder.innerText);
    if (score > 0) {
        scoreHolder.innerText = --score;
    } else {
        message.textContent = "💥 You lost the game!";
        return;
    }

    // Match guess with secret number.
    if (val > secretNumber) {
        message.textContent = "📈 Too high!";
    } else if (val < secretNumber) {
        message.textContent = "📉 Too low!";
    } else {
        // val === number)
        message.textContent = "Correct Number 🏆";
        document.body.style.backgroundColor = "#60b347";
        divNumber.textContent = val;
        const highsocre = Number(highscoreHolder.textContent);
        if (score > highsocre) {
            highscoreHolder.textContent = score;
        }
    }
});

function modifyTextContent(selector, text) {
    document.querySelector(selector).textContent = text;
}
