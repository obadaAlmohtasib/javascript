"use strict";

// A Better Way The Intersection Observer API
const handleIntersect = function (entries) {
  const [entry] = entries; // const entry = entries[0];
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const navObserver = new IntersectionObserver(handleIntersect, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`, //  "-" + getComputedStyle(nav).height,
  // Start the intersection before "90px" of complete hidden;
  // Is a box of pixels that will be applied outside
  // of the target element.
});
navObserver.observe(document.querySelector("header"));

// // Solution - Depending on previous element's visibility -
// // observer callback method get called with two arguments:
// // entries: an array of the threshold values.
// // observer: the observer object.
// const handleIntersect = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//     if (
//       !entry.intersectionRatio && // intersectionRatio === 0
//       !entry.isIntersecting // Is not intersecting anymore
//     )
//       nav.classList.add("sticky");
//     else nav.classList.remove("sticky");
//   });
// };

// // Intersection observer options
// // 1. root:  Must be the ancestor of the target. Defaults (if not specified) to the browser viewport or if null.
// const obsOptions = {
//   root: null,
//   threshold: [0],

//   /*
//   "0" percent: means that basically the callback will trigger each time that the target
//   element moves completely out of the view and also as soon as it enters the view.

//   on the other hand if we specified "1" then that means the callback will
//   only be called when 100% of the target is actually visible in the viewport
//   so in the case of this "section--one" that would be impossible because the
//   section itself is already bigger than the viewport.
// */
// };
// const observer = new IntersectionObserver(handleIntersect, obsOptions);
// observer.observe(document.querySelector("header"));

// /////////////////////////////////////////////////////////////////////////////////////

// this is pretty bad for performance, so using the scroll event for performing
// a certain action at a certain position of the page is really not the way to go
// and again that's because the scroll event fires all the time no matter
// how small the change.

// Bad Old-school way
// const initialCoords = section1?.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });
