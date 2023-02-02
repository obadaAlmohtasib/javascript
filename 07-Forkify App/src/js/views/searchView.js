class SearchView {
  _parentEl = document.querySelector(".search");

  getQuery() {
    const query = this._parentEl.querySelector(".search__field").value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector(".search__field").value = "";
    this._parentEl.querySelector(".search__field").blur();
  }

  addHandlerSearch(handler) {
    const searchBtn = document.querySelector(".search__btn");
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
