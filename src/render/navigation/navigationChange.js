import { renderFilmPreview } from "../async/filmPreview.js";
import { doom } from "../global/doom.js";
import { searchFilmsRender } from "../async/searchFilmsRender.js";

const searchFormInput = doom.searchFormInput
const searchButton = doom.searchButton

const navigationChange = () => {
  const goBackElement = () => {
    const value = decodeURI(location.hash.split("_")[1]);
    if (value !== 'undefined') {
      searchFormInput.value = value
      searchFilmsRender(searchFormInput.value)
    } else {
      searchFormInput.value = ''
      searchFilmsRender(searchFormInput.value)
    }
  }
  
  // filmPreview
  
  if (location.hash.startsWith('#filmPreview')) {
    const id = location.hash.split('_')[1]
    renderFilmPreview(id)
  }
  
  window.addEventListener('hashchange', () => {
    goBackElement();
    if (location.hash.startsWith('#filmPreview')) {
      const id = location.hash.split('_')[1]
      renderFilmPreview(id)
    }
  });

}

export { navigationChange }