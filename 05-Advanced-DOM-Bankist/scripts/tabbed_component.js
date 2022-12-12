"use strict";

// NEW solution
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
tabsContainer.addEventListener("click", e => {
  // Use closest when u need to check matching on the current and on the parent.
  // upwards traversal
  let clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach(c => c.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  const selector = `.operations__content--${clicked.dataset.tab}`;
  document.querySelector(selector).classList.add("operations__content--active");
});

// ////////////////////////////////////////////////////////////////////////////////////

// OLD solution:
// let currentActive = 1;
// const tabsContainer = document.querySelector(".operations__tab-container");
// tabsContainer.addEventListener("click", e => {
//   let clicked;
//   if (e.target.matches(".operations__tab")) clicked = e.target;
//   else if (e.target.parentElement.matches(".operations__tab"))
//     clicked = e.target.parentElement;

//   if (clicked) {
//     // Remove Activity from current
//     tabsContainer
//       .querySelector(`.operations__tab--${currentActive}`)
//       ?.classList.remove(`operations__tab--active`);

//     document
//       .querySelector(`.operations__content--${currentActive}`)
//       ?.classList.remove(`operations__content--active`);

//     currentActive = clicked.dataset.tab;
//     // Add activity to new clicked
//     clicked.classList.add("operations__tab--active");

//     const selector = `.operations__content--${currentActive}`;
//     document
//       .querySelector(selector)
//       .classList.add("operations__content--active");
//   }
// });
