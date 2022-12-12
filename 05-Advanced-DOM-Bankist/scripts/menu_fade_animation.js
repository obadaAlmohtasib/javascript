"use strict";

// NOTE, we use the bind method to pass an argument into a handler function.
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav")?.querySelectorAll(".nav__link");
    const logo = link.closest(".nav")?.querySelector("img");
    siblings.forEach(el => (el.style.opacity = this));
    logo.style.opacity = this;
    link.style.opacity = 1;
  }
};

const nav = document.querySelector(".nav");
// NOTE, pointerenter event doesn't bubble up
// So use the pointerover event.
nav.addEventListener("pointerover", handleHover.bind(0.5));

// we have to listen for the oppiste event, so we can undo what we have did.
// NOTE, pointerleave event doesn't bubble up, So use the pointerout event.
nav.addEventListener("pointerout", handleHover.bind(1));
