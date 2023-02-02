import iconsUrl from "url:../../img/icons.svg"; // Parcel 2
import { PreviewView } from "./previewView.js";
const [icons] = iconsUrl.split("?");

class ResultsView extends PreviewView {
  _parentEl = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again :)";
  _message = "";

  _generateMarkup() {
    return this._data.map(rec => this._generateMarkupPreview(rec)).join("");
  }
}

export default new ResultsView();
