"use strict";
//  Windows 10 + Dot   =>  To add Emoji
// Alt + the word

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

/*
The default behavior when we click a link that has "#" as the hyperlink so as href
is make the page jump to the top and so we've to preventing that default.
*/
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// NOTE: the nodeList isn't an array, but is still has the forEach() method.
btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////
// Selecting, Creating, Inserting, and Deleting elements
// Add cookie
// Note: the element can be added only once,
// otherwise you need to use .cloneNode() on element to copy it. and passing true param for deep cloning.
const cookie = document.createElement("div");
cookie.id = "div-cookie";
cookie.classList.add("cookie-message");
// cookie.style.backgroundColor = "lightblue";
// cookie.style.height = "20px";

cookie.innerHTML =
  "We use cookies for improved functionality and analytics. <button class='btn btn--close-cookie'>Got it!</button>";

const header = document.querySelector(".header");
// Insert at the end of the element. - As last child -
// header.prepend(cookie);

// Insert at the beginning of the element. - As first child -
header.append(cookie);

// Insert element as a sibling (before/ after)
// header.before(cookie);
// header.after(cookie);

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", () => cookie.remove());
// Other way to remove is element.removeChild()

// Styles
cookie.style.backgroundColor = "#37383d";
// To forcibly take the full width and ignore parents padding
cookie.style.position = "absolute";
cookie.style.bottom = "0";
// You can print the value of inline css styles:
// console.log(cookie.style.backgroundColor);

// in case you need to access all styles applied to certain element, u've to use a method, and passing the desired element.
// getComputedStyle(cookie).property;
// console.log(getComputedStyle(cookie).height);
cookie.style.height =
  Number.parseFloat(getComputedStyle(cookie).height) + 30 + "px";

// Attributes
// You can access common & unique attrib for each elements in DOM.
const logo = document.querySelector(".nav__logo");
// and since logo is an img, you can do: (logo.alt , logo.src , logo.className)

// The usage might be a little different
// console.log(logo.src); // returns the absolute path (full complete path)
// console.log(logo.getAttribute("src")); // returns the relative path (relative to html file)
// console.log(logo.getAttribute("designer"));

// Also in links
// const navLink = document.querySelector(".nav__link--btn");
// console.log(navLink.href); // returns the absolute path (full complete path)
// console.log(navLink.getAttribute("href")); // returns the relative path (relative to html file)

// Non-standard
logo.setAttribute("company", "Bankist");

// Data attributes (are special kind of attrib that starts with the word "data-")
// [data-*] or more clear "data-" and then whatever you want.
// The special about these attrib is they can be accessed using dataset property.
// console.log(logo.dataset.versionNumber); // use camel case

// ////////////////////////////////////////////////
// Events and Event Handlers
// const h1 = document.querySelector("h1");
// NOTE: the resize event only valid for the window
// const sayHello = function () {
//   alert("addEventListener: Great! the resize event triggered :D");
// };
// h1.addEventListener("mouseenter", sayHello);

// Another way of attaching an event listener to an element
// by using the so-called "on event" property.
// h1.onmouseenter = function () {
//   alert("addEventListener: Great! the resize event triggered :D");
// };

// setTimeout(() => {
//   h1.removeEventListener("mouseenter", sayHello);
//   console.log("mouseenter event on h1 element was removed!");
// }, 3000);

// rgb(255, 255, 255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// Event Propagation [Capturing, Target, Bubbling]
// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   console.log("LINK: matches = ", e.target.matches(".nav__link"));
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   console.log("LIST: matches = ", e.target.matches(".nav__links"));
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector(".nav").addEventListener("click", function (e) {
//   console.log("NAV: matches = ", e.target.matches(".nav"));
//   this.style.backgroundColor = randomColor();
// });

// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// Global event
// lifecycle DOM events

/*
in fact we want all our code only to be executed after the dom is ready so does that 
mean that we should wrap our entire code into an event listener like this
well actually no we don't need to do that and that's because we have the
script tag which is the one that imports our javascript into the html
at the end of the html body.
*/
// document.addEventListener("DOMContentLoaded", function () {
//   // Note, this event doesn't actually wait for images and other
//   // external resources to load, just html and javascript need to be loaded
//   console.log(`HTML parsed and DOM tree built!`);
// });

/*
  the load event is fired by the window as soon as not only the html is
  parsed but also all the images and external resources like css files are
  also loaded => so basically when the complete page has finished loading 
  is when this event gets fired.
*/
// window.addEventListener("load", function () {
//   console.log(`Page fully loaded`);
// });

/*
this event here is created immediately before a user is about to
leave a page.
so for example after clicking the close button in the browser tab
so we can basically use this event to ask users if they are 100 sure that they
want to leave the page.
now in some browsers to make this work we need to call prevent default.
 - in chrome it's not necessary but some browsers require it -

*/
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   // in order to display a leaving confirmation we need to set the
//   // return value on the event to an empty string.
//   e.returnValue = "";
// });

/**
 * so really please don't abuse this kind of feature because a message like
 * this is of course pretty intrusive and it should only be displayed when necessary
 * 
 * so the only time you should prompt the user if they really want to leave the
  page is for example when the user is leaving in the middle of filling out the form or
  like writing a blog post or something like that.
  
  so a situation in which data could actually be lost by accident.
 *
 */
