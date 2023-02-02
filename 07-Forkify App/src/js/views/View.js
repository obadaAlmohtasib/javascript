import iconsUrl from "url:../../img/icons.svg"; // Parcel 2
const [icons] = iconsUrl.split("?");
/**
 * with Parcel and Babel, inheritance between these truly private fields and methods doesn't really work yet.
 * So maybe that might be possible at some point in the future
 * but for now, we will have to use protected fields and protected methods. instead of hash symbols.
 */
export class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @returns {undefined}
   * @this {Object} View instance
   * @author Obada Almohtasib
   * @todo Finish implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Updating the View rather than re-render it, so it didn't cause a performance issue.
   * (e.g. Updating recipe ingredients quantity according to servings | Adding or Deleting a bookmarked recipe)
   * @param {*} data
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Convert the New Markup string to a DOM object that's living in the memory
    // And that we can then use to compare with the actual DOM that's on the page.
    // Document Fragment: is a virtual DOM Container;
    const docFrag = document.createRange().createContextualFragment(newMarkup);
    const newElements = [...docFrag.querySelectorAll("*")];
    const curElements = [...this._parentEl.querySelectorAll("*")];
    // prettier-ignore
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]; // May be NULL.    

      // Updates changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() != "") 
      {
        curEl.textContent = newEl.textContent;
      }
      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);          
        });
      }
      // || OR By Combining Two
      // if (!newEl.isEqualNode(curEl))
      // {
      // innerHTML: Updates the entire element alongside to its content, properties, attributes, and childs
      //   curEl.innerHTML = newEl.innerHTML;
      // }
    });
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   *
   * @param {string} [message=this._message]
   * @returns {undefined}
   * @this {Object} View instance
   */
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
        <svg>
            <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        </div>
        <p>${message}</p>
    </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
