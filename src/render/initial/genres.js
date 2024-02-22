import { global } from "../global/vars.js";
import { doom } from "../global/doom.js";

const genresList = global.genres;
const genre = doom.genre;
const selectGenre = () => doom.selectGenre.textContent;
const selectCategories = () => doom.selectCategories.textContent;

const renderGenres = () => {
  genresList.forEach((element) => {
    const contentSummary = doom.contentSummary;
    const genre = document.createElement("p");
    genre.textContent = element;
    contentSummary.append(genre);

    addGenreEventListeners(genre);
  });
};

const addGenreEventListeners = (genreElements) => {
  const genreSelect = doom.genreSelect;

  genreElements.addEventListener("click", (e) => {
    const genre = e.target.textContent;
    if (e.target.textContent === genreSelect.textContent) {
      return;
    }
    genreSelect.textContent = genre;
    updateSelectGenre();
  });
};

const updateSelectGenre = () => {
  genre.value = `${selectGenre()} / ${selectCategories()}`; // renderFilmsGenre()
};

renderGenres();

export { renderGenres };
