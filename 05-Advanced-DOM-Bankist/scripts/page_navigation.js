"use strict";
// Best solution
// Event Delegation [ Includes two steps: ]
// 1. Add event listener to common parent element.
// 2. Determine what element originated the event.
const linksContainer = document.querySelector(".nav__links");
linksContainer.addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy [ e.target.matches("a") ]
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    const sec = document.querySelector(id);
    const coords = sec?.getBoundingClientRect();
    window.scrollTo({
      left: coords.left + window.scrollX,
      top: coords.top + window.scrollY,
      behavior: "smooth",
    });
  }
});

/// First way
// document.querySelectorAll("a.nav__link").forEach(link =>
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     const sec = document.querySelector(`${this.getAttribute("href")}`);
//     const coords = sec?.getBoundingClientRect();
//     coords &&
//       window.scrollTo({
//         left: coords.left + window.scrollX,
//         top: coords.top + window.scrollY,
//         behavior: "smooth",
//       });
//   })
// );

// document.querySelectorAll("a.nav__link").forEach((link, i) =>
//   link.addEventListener("click", e => {
//     e.preventDefault();
//     const sec = document.getElementById(`section--${i + 1}`);
//     const coords = sec?.getBoundingClientRect();
//     coords &&
//       window.scrollTo({
//         left: coords.left + window.scrollX,
//         top: coords.top + window.scrollY,
//         behavior: "smooth",
//       });
//   })
// );

/// Second way
// document.querySelectorAll("a.nav__link").forEach(link =>
//   link.addEventListener("click", function () {
//     // Using arrow function will loses "this" pointer
//     const delimiter = this.textContent.toLowerCase();
//     const coords = document
//       .querySelector(`.section__title--${delimiter}`)
//       .parentElement.getBoundingClientRect();

//     window.scrollTo({
//       left: coords.left + window.scrollX,
//       top: coords.top + window.scrollY,
//       behavior: "smooth",
//     });
//   })
// );
