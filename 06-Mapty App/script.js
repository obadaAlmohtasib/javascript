"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const findBtn = document.querySelector(".find__btn");

// Really working on the real world, probably you have many users using the same application,
// and some users can create objects at the same time and so by then relying on the Date => timestamp
// the time to create ids is going to be a really bad idea.
class IdUtil {
  static #smallLetters = "abcdefghijklmnopqrstuvwxyz".split("");
  static #capitalLetters = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
  static #specialLetters = "~!@#$%^&*()_+".split("");

  static generate() {
    let suffix = "";
    suffix += IdUtil.#specialLetters[Math.trunc(Math.random() * 13)];
    suffix += IdUtil.#capitalLetters[Math.trunc(Math.random() * 26)];
    suffix += IdUtil.#smallLetters[Math.trunc(Math.random() * 26)];
    return suffix;
  }
}

class Workout {
  id;
  date;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in Km
    this.duration = duration; // in Min
    this.date = new Date();
    this.id = this.date.getTime() + IdUtil.generate();
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.constructor.name} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  // static types = {
  //   running: "🏃‍♂️",
  //   cycling: "🚴‍♀️",
  //   swimming: "🏊‍♀️",
  // };
}

class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //  Min/Km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // Km/H
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// Test....
// const workoutRu = new Running([39, -12], 5.2, 24, 178);
// console.log(workoutRu);
// const workoutCy = new Cycling([39, -12], 27, 95, 523);
// console.log(workoutCy);

///////////////////////////////////////////////
// APPLICATION ARCHITECTURE
class App {
  #workouts = [];
  #map;
  #mapZoomLevel = 13;
  #MAX_ZOOM_LEVEL = 18;
  #mapEvent;

  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("input", this._toggleElevationField);

    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));

    findBtn.addEventListener("click", this._locateUser.bind(this));

    this._getLocalStorage();
  }

  _locateUser() {
    navigator.geolocation?.getCurrentPosition(
      // Success callback
      position => {
        const { latitude: lat, longitude: lng } = position.coords;
        this.#map.setView([lat, lng], this.#MAX_ZOOM_LEVEL, {
          animate: true,
          pan: { duration: 1 },
        });
      },
      // Error callback
      function () {
        window.alert("Could not get ur position");
      }
    );
  }

  _getPosition() {
    navigator.geolocation?.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        window.alert("Could not get ur position");
      }
    );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    // setView: ([lat, lng], zoom) the position in where to center the map view.
    this.#map = L.map("map").setView([latitude, longitude], this.#mapZoomLevel);

    // tileLayer => the background squares (or small tiles) the map made of.
    // "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.marker([latitude, longitude])
    //   .addTo(this.#map)
    //   .bindPopup("Ur live position 👋")
    //   .openPopup();

    // Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));

    this.#workouts.forEach(wo => {
      this._renderWorkoutMarker(wo);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    // To disable the animation when hide form => we've to immediately hide it.
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000); // 1s is the time of animation in CSS
  }

  _toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();

    // Chech for valid data
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositives = (...inputs) => inputs.every(inp => inp > 0);

    const builder = function () {
      const { lat, lng } = this.#mapEvent.latlng;
      return [[lat, lng], distance, duration];
    };

    let workout;
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositives(distance, duration, cadence)
      )
        return alert("Plz, enter valid inputs");

      workout = new Running(...builder.call(this), cadence);
    }

    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositives(distance, duration)
      )
        return alert("Plz, enter valid inputs");

      workout = new Cycling(...builder.call(this), elevation);
    }
    this.#workouts.push(workout);

    // [1] Render workout on map
    this._renderWorkoutMarker(workout);

    // [2] Render workout in list
    this._renderWorkout(workout);

    // [3] Clear input fields + Hide form
    this._hideForm();

    // [4] Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    // type || workout.constructor.name || workout.__proto__.constructor.name
    L.marker(workout.coords) // Forma: [lat, lng]
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          content: `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${
            workout.description
          }`,
          className: `${workout.type}-popup`,
          autoClose: false,
          closeOnClick: false,
        })
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    // NOTE, we use "data-*" attributes to usually build a bridge between the
    // User interface and the data that we have in our application.
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`;

    if (workout.type === "running") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>`;
    }
    if (workout.type === "cycling") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`;
    }

    form.insertAdjacentHTML("afterend", html);
    // Bad solution: Instead of attaching event to each list item, Do event delegation.
    // form.nextElementSibling.addEventListener(
    //   "click",
    //   this._moveMapTo.bind(this)
    // );
  }

  // _moveMapTo(e) {
  //   // [1] Element: e.currentTarget || e.target.closest("li")
  //   // [2] Find / Search => depends on id
  //   const wo = this.#workouts.find(wo => wo.id === e.currentTarget.dataset.id);
  //   this.#map.setView(wo.coords, this.#mapZoomLevel);
  // }

  /**
   *
   * IMPORTANT
   *  with [data-*] attrib we can then basically build a bridge between the user interface and the data that we have actually
   * in our application, so in this case our data is in the workouts array.
   *  because if we didn't have the [data-id] attrib stored in the user interface then how would we know which is the objects in
   * the workouts array that we need to scroll to. and so we need the [data-id] so that we can now read it and basically
   * then select the element out of the workouts array using this id.
   */
  _moveToPopup(e) {
    const target = e.target.closest(".workout");
    if (!target) return; // null is falsy value

    // Search / Find
    const wo = this.#workouts.find(wo => wo.id === target.dataset.id);
    this.#map.setView(wo.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  /** In localStorage API, the data is basically linked to the URL. */
  _setLocalStorage() {
    window.localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(wo => {
      this._renderWorkout(wo);
      // we're trying to add a marker to the map right at the beginning
      // however at this point the map has actually not yet been loaded
      // map initialization takes a bit long
      // this._renderWorkoutMarker(wo);
    });
  }

  reset() {
    // Delete all
    localStorage.removeItem("workouts");
    // Reload programmatically so the app looks completely empty
    location.reload();
  }
}

const app = new App();
