// import icons from "../../img/icons.svg"; // Parcel 1
import { Fraction } from "fractional";
import iconsUrl from "url:../../img/icons.svg"; // Parcel 2
import { View } from "./View.js";
const [icons] = iconsUrl.split("?");

// In order to Show/Hide this window, the controller does not interfere at all.
// Now what we will have to do in the controller still is to import this object here
// because otherwise, our main script sort of controller will never execute this file.
// And so then this object here will never be created.
// And so the event listener here will never be added.
// And so we need to, again, import this so that the code that is in the module is actually being run.
class AddRecipeView extends View {
  _parentEl = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded :)";
  _isFormVisible = true;

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this._openWindow.bind(this));
  }

  _openWindow() {
    if (!this._isFormVisible) {
      this._generateMarkup();
      this._isFormVisible = true;
    }
    this.toggleWindow();
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  renderError(message = "Something Went Wrong!") {
    super.renderError(message);
    this._isFormVisible = false;
  }

  renderMessage(message = this._message) {
    super.renderMessage(message);
    this._isFormVisible = false;
  }

  // prettier-ignore
  _generateMarkup() {
    const markup = `
    <div class="upload__column">
      <h3 class="upload__heading">Recipe data</h3>
      <label>Title</label>
      <input value="TEST" required name="title" type="text" />
      <label>URL</label>
      <input value="TEST" required name="sourceUrl" type="text" />
      <label>Image URL</label>
      <input value="TEST" required name="image" type="text" />
      <label>Publisher</label>
      <input value="TEST" required name="publisher" type="text" />
      <label>Prep time</label>
      <input value="23" required name="cookingTime" type="number" />
      <label>Servings</label>
      <input value="23" required name="servings" type="number" />
    </div>

    <div class="upload__column">
      <h3 class="upload__heading">Ingredients</h3>
      <label>Ingredient 1</label>
      <input
        value="0.5,kg,Rice"
        type="text"
        required
        name="ingredient-1"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 2</label>
      <input
        value="1,,Avocado"
        type="text"
        name="ingredient-2"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 3</label>
      <input
        value=",,salt"
        type="text"
        name="ingredient-3"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 4</label>
      <input
        type="text"
        name="ingredient-4"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 5</label>
      <input
        type="text"
        name="ingredient-5"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 6</label>
      <input
        type="text"
        name="ingredient-6"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
    </div>

    <button class="btn upload__btn">
      <svg>
        <use href="src/img/icons.svg#icon-upload-cloud"></use>
      </svg>
      <span>Upload</span>
    </button>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new AddRecipeView();
