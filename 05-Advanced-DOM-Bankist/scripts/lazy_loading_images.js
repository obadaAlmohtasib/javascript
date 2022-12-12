"use strict";
/*
    one of the most important things when building any website is performance
    and images have by far the biggest impact on page loading and so it's very
    important that images are optimized on any page.
    and for that we can use a strategy called "lazy loading images".
*/

// Selecting elements based-on custom attribute
const images = document.querySelectorAll("img[data-src]");

const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  // Js behind the scenes, loading and replacing the img,
  // and by the time js finished, it will emits load event
  entry.target.setAttribute("src", entry.target.dataset.src);

  // so the filter disappear, right after the image loaded.
  // and not removing the filter first so that will displaying the low resolution image
  entry.target.onload = function () {
    entry.target.classList.remove("lazy-img");
  };

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  // ideally we don't want users to notice that we are lazy loading images - all in background -
  // So we don't see any delay on loading the page, and as we approach the img => they're fully loaded.
  rootMargin: "200px",
});
images.forEach(img => imgObserver.observe(img));
/*
    so the main ingredient to the lazy loading strategy
    is that to have a very low resolution image which is really small and which is
    loaded right in the beginning.
    so that the dimensions and size are really small
    while the real one almost bigger.
*/
