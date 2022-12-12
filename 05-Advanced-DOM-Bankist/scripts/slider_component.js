"use strict";

const slides = document.querySelectorAll(".slide");
const slider = slides[0].parentElement;
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotsContainer = document.querySelector(".dots");

const createDots = function () {
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("dots__dot");
    dot.dataset.slide = i; // Create custom attrib

    dotsContainer.appendChild(dot);
  });

  dotsContainer.children[0].classList.add("dots__dot--active");
};

// work the same way for both directions
// no matter if its was forward or backward
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    }
    // Suppose current slide is 2
    // first iteration: (0 - 2) * 100 = -200%
    // second iteration: (1 - 2) * 100 = -100%
    // third iteration: (2 - 2) * 100 = 0%
    // fourth iteration: (3 - 2) * 100 = 100%
    // and so on...
  );
  dotsContainer.children[slide].classList.add("dots__dot--active");
};

const init = () => {
  // Rearrange slides horizontally
  createDots();
  goToSlide(0);
};
init();

let currentSlide = 0;
const maxSlide = slides.length;

const nextSlide = function () {
  dotsContainer.children[currentSlide].classList.remove("dots__dot--active");
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
};

const prevSlide = function () {
  dotsContainer.children[currentSlide].classList.remove("dots__dot--active");
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
};

// Event handlers
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

dotsContainer.addEventListener("click", function (e) {
  if (e.target.matches("button")) {
    // e.target.classList.contains("dots__dot")
    this.children[currentSlide].classList.remove("dots__dot--active");
    currentSlide = +e.target.dataset.slide;
    goToSlide(currentSlide);
  }
});

// const resetOrder = function (reverse = false) {
//   slides.forEach((slide, i) => {
//     const set = reverse ? (order.length - i - 1) * -100 : i * 100;
//     order.splice(i, 1, set); // replace
//     slide.style.transform = `translateX(${order[i]}%)`;
//     console.log(order, "Set: ", set);
//   });
// };

// let appearance = 0;
// const order = [];
// resetOrder();

// const swipeSlide = function (num) {
//   console.log(num);
//   for (let i = 0; i < order.length; i++) {
//     order[i] = order[i] + num;
//   }
//   slides.forEach(
//     (slide, i) => (slide.style.transform = `translateX(${order[i]}%)`)
//   );
//   console.log(order, " Current Appearance: ", appearance);
// };

// // Next slide
// btnRight.addEventListener("click", function () {
//   if (++appearance >= order.length) {
//     appearance = 0;
//     resetOrder();
//     return;
//   }
//   // Move all to left (-ve)
//   swipeSlide(-100);
// });

// // Prev slide
// btnLeft.addEventListener("click", function () {
//   if (--appearance < 0) {
//     appearance = order.length - 1;
//     resetOrder(true);
//     return;
//   }
//   // Move all to rights (+ve)
//   swipeSlide(100);
// });
