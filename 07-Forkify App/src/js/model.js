import { API_URL, RES_PER_PAGE, KEY } from "./config";
import { AJAX, deleteRecipe } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    pagination: {
      prev: 0,
      next: 2,
    },
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // Conditionally add properties to an object.
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    // Reformat the fetched data, so make it a little bit nicer
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Propagating error
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }), // Conditionally add properties to an object.
      };
    });
    state.search.page = 1;
    console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  // [(1 - 1) * 10, 1 * 10] === [10, 20]
  // [(2 - 1) * 10, 2 * 10] === [20, 30]
  // etc...
  // First we've to update state.search.page to the current page
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  // update pagination values
  updatePaginationState();
  return state.search.results.slice(start, end);
};

const updatePaginationState = function () {
  const currentPage = state.search.page;
  const lastPage = Math.ceil(state.search.results.length / RES_PER_PAGE);

  // (Last page === 0) => No results
  // (Last page === First page) => One page results
  if (lastPage === 0 || lastPage === 1) return updatePagination(0, 0);

  // Last page === Current page, Last page reached
  if (lastPage === currentPage) return updatePagination(currentPage - 1, 0);

  // Last page > Current page, More than one page results
  if (currentPage === 1 && lastPage > currentPage)
    return updatePagination(0, 2);

  // Last page > Current page, More than one page results
  if (currentPage > 1 && lastPage > currentPage)
    return updatePagination(currentPage - 1, currentPage + 1);
};

const updatePagination = function (prev, next) {
  state.search.pagination.prev = prev;
  state.search.pagination.next = next;
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // EQ: QuantityForOne * NumOfServings
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const deleteAllOwnUploadedRecipes = function () {
  // 1) Delete from API
  // deleteRecipe(url, id);
  // 2) Delete from local storage
  // localStorage.setItem("bookmarks", JSON.stringify(JSON.parse(localStorage.bookmarks).filter(el => !el.key)));
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.removeItem("bookmarks");
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  // prettier-ignore
  try {
    const ingredients = Object.entries(newRecipe).filter(entry =>
        entry[0].toLowerCase().startsWith("ingredient") && 
        entry[1].trim() !== ""
      ).map(ing => {
        const ingArr = ing[1].split(",").map(el => el.trim());
        // const ingArr = ing[1].replaceAll(" ", "").split(",");

        if (ingArr.length !== 3)
          throw new Error("Wrong ingredient format! Please use the correct format :)");

        const [quantity, unit, description] = ingArr;
        return { quantity: +quantity || null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    return data;
  } catch (err) {
    throw err;
  }
};
