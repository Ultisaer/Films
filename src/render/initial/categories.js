// categoryRenderer.js
import { doom, doomAll } from "../global/doom.js";
import { API, options } from "../global/configuration.js";
import { global } from "../global/vars.js";
import { settings } from "../../settings.js";
import { updateSelectGenre } from "../create/updateGenre.js";
const categoriesList = global.categories;

const renderCategories = async () => {
  const contentCategories = doom.contentCategories;
  const response = await fetch(
    `${settings.API_URL}/genre/movie/list?`,
    options
  );
  const data = await response.json();
  data.genres.forEach((element) => {
    const category = document.createElement("p");
    category.textContent = element.name;
    contentCategories.append(category);
    categoriesList[element.name] = element.id;
  });

  updateSelectGenre();
  addCategoryEventListeners();
};

const addCategoryEventListeners = () => {
  const categoryElements = doomAll.categoryElements();
  const categorySelect = doom.categorySelect;

  categoryElements.forEach((p) => {
    p.addEventListener("click", (e) => {
      e.stopPropagation();
      const category = e.target.textContent;
      categorySelect.textContent = category;
      updateSelectGenre();
    });
  });
};

export { renderCategories };
