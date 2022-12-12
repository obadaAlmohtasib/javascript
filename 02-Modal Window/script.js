"use strict";
//  Windows 10 + Dot   =>  To add Emoji
const modalButtons = document.querySelectorAll(".show-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const openModal = () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

for (let i = 0; i < modalButtons.length; i++) {
    modalButtons[i].addEventListener("click", openModal);
}

// Notice, including parentheses will immediately invoking the function,
// And it doesn't work.
document.querySelector(".close-modal").addEventListener("click", closeModal);

// You can also do:
// Element.Event = Callback_Function
// overlay.onclick = closeModal;
overlay.addEventListener("click", closeModal);

// Note: The onkeypress event is not fired for all keys (e.g. ALT, CTRL, SHIFT, ESC) in all browsers. To detect only whether the user
// has pressed a key, use the onkeydown event instead, because it works for all keys.

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeModal();
    }
});
