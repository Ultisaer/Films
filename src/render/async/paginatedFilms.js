import { generateImgs } from "../create/imageGenerator.js"
import { doom } from "../global/doom.js"
// window.addEventListener("hashchange", location, false);

let type = ''

const location = () => {
  if (location.hash === '#allFilms_Trending') {
    trendingInfiniteScroll
  } else if (location.hash === '#allFilms_Genre') {
    genreInfiniteScroll
  }
}
let maxPage;

const renderPaginatedFilms = () => {

}

export {renderPaginatedFilms }