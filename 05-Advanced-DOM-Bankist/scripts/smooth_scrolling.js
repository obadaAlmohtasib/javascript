"use strict";
// We're gonna see two ways of doing the smoothy scrolls.

// First one: a bit more old school which shows a couple
// of interesting stuff.

// Element that causes the scrolling
const btnScrollTo = document.querySelector(".btn--scroll-to");

// Element that we want to scroll to
const section1 = document.getElementById("section--1"); // #

btnScrollTo.addEventListener("click", function (e) {
  // the getBoundingClientRect() method is relative to the visible viewport.
  // coordinates.
  // const s1coords = section1.getBoundingClientRect();
  // console.log(e.target.getBoundingClientRect());
  // console.log(s1coords);

  // How much get scrolling far from the top of the page, and the most left of the page.
  // console.log(
  //   "Current scroll position (X/Y): ",
  //   window.scrollX,
  //   window.scrollY
  // );

  // Dimension of visible viewport
  // console.log(
  //   "height/width viewport",
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling (horizontal scroll, vertical scroll)
  // (x, y) [from left, from top];
  // window.scrollTo(
  //   s1coords.left + window.scrollX,
  //   s1coords.top + window.scrollY
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: "smooth",
  // });
  // section1.getBoundingClientRect().top is relative to the Top-Edge of viewport and not to the document.
  // but what we need actually is to determine the absolute position of the element relative to the entire document.

  // Finally: the more modern way which only works in
  // super modern browsers.
  section1.scrollIntoView({ behavior: "smooth" });
});
