import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable"; // Polyfilling everything else.
import "regenerator-runtime/runtime"; // Polyfilling async/await.

// Reference Links */
// https://forkify-v2.netlify.app
// https://forkify-api.herokuapp.com/v2

// URLs Example */
// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcd09

///////////////////////////////////////
async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    // loadRecipe function is an async function and therefore, it is going to return a promise.
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err.message} 💥💥💥💥`);
  }
}

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    const searchResults = model.getSearchResultsPage();
    resultsView.render(searchResults);

    paginationView.render(model.state.search.pagination);
  } catch (err) {
    resultsView.renderError(err);
  }
};

const controlPagination = function (goToPage) {
  const searchResults = model.getSearchResultsPage(goToPage);
  resultsView.render(searchResults);
  paginationView.render(model.state.search.pagination);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view (By Re-Render It)
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    location.search = "";
    window.history.pushState(null, null, `#${model.state.recipe.id}`);

    location.hash = model.state.recipe.id;
  } catch (err) {
    console.error(`💥`, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  // Publisher-Subscriber pattern
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
