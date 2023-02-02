import { View } from "./View.js";
import iconsUrl from "url:../../img/icons.svg";
const [icons] = iconsUrl.split("?");

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");

  addHandlerClick(handler) {
    // Event delegation
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    let markup = "";
    if (this._data.prev)
      markup += `
        <button data-goto="${this._data.prev}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.prev}</span>
        </button>`;

    if (this._data.next)
      markup += `
        <button data-goto="${this._data.next}" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.next}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;

    return markup;
  }
  _generateMarkupButtons(prev, next) {}
}
export default new PaginationView();
