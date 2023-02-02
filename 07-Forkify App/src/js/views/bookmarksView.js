import iconsUrl from "url:../../img/icons.svg"; // Parcel 2
import { PreviewView } from "./previewView.js";
const [icons] = iconsUrl.split("?");

class BookmarksView extends PreviewView {
  _parentEl = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  _message = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data.map(rec => this._generateMarkupPreview(rec)).join("");
  }
}

export default new BookmarksView();
