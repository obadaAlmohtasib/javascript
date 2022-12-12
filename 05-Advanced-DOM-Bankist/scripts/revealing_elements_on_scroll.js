"use strict";

// Revealing elements only once.
const revealElement = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  // Stop observing, in case you've got work done, for better performance.
  observer.unobserve(entry.target);
};

const elObserver = new IntersectionObserver(revealElement, {
  root: null, // viewport
  //   rootMargin: "-30px",
  threshold: 0.15,
});

const domSections = document.querySelectorAll(".section");

domSections.forEach(sec => {
  sec.classList.add("section--hidden");
  elObserver.observe(sec);
});

// /////////////////////////////////////////////////////////////////////////
// Revealing elements infinitely in both downward and upward scrolling.
// const revealElement = function (entries) {
//   const [entry] = entries;
//   if (entry.isIntersecting) {
//     entry.target.classList.remove("section--hidden");
//   } else {
//     entry.target.classList.add("section--hidden");
//   }
// };

// const elObserver = new IntersectionObserver(revealElement, {
//   root: null, // viewport
//   //   rootMargin: "-30px",
//   threshold: 0.15,
// });

// const domSections = document.querySelectorAll(".section");

// domSections.forEach(sec => {
//   sec.classList.add("section--hidden");
//   elObserver.observe(sec);
// });
