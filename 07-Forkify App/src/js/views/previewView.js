import iconsUrl from "url:../../img/icons.svg"; // Parcel 2
import { View } from "./View.js";
const [icons] = iconsUrl.split("?");

export class PreviewView extends View {
  _parentEl = "";

  _generateMarkupPreview(recipe) {
    const id = window.location.hash.slice(1);
    // prettier-ignore
    return `<li class="preview">
      <a class="preview__link ${recipe.id === id ? "preview__link--active" : ""}" href="#${recipe.id}">
        <figure class="preview__fig">
            <img src="${recipe.image}" alt="${recipe.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>   
          <div class="preview__user-generated ${recipe.key || "hidden"}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>`;
  }
}
