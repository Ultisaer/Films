import { doom } from "../global/doom.js";
import { API } from "../global/configuration.js";
import { generateImgs  } from "./imageGenerator.js"
import { global } from "../global/vars.js";

let maxPage;
let page = 1;

const categoriesList = global.categories

const genre = doom.genre
const trending = doom.trending
const trendingTitle = doom.trendingTitle.textContent
const selectGenre = () => doom.selectGenre.textContent
const selectCategories = () => doom.selectCategories.textContent
trending.value = trendingTitle

const updateSelectGenre = () =>  {
  genre.value = `${selectGenre()} / ${selectCategories()}`
  renderFilmsGenre()
}

// Renderiza las peliculas en base al value establecido
const renderFilmsGenre = async () => { // LM
  const [genreData , category] = genre.value.split('/ ')
  const id = categoriesList[category]
  const dataQuery = await API('discover/movie', {
    params: {
      with_genres: id,
    },
  });
  maxPage = dataQuery.data.total_pages
  const results = dataQuery.data.results

  filmsGenrePrevius(results)
  filmsGenreContent(results)
}

const filmsGenrePrevius =  (results) => {
  const genreContent = doom.genreContent
  genreContent.innerHTML = ''
  const minData = results.slice(0, 6);
  generateImgs(minData, genreContent)
  doom.genreContentLoader.style.display = 'none'
}

const filmsGenreContent = (results) => {
  const allFilmsTitle = doom.allFilmsTitle
  const allFilmsContainer = doom.allFilmsContainer
  allFilmsTitle.textContent = genre.value
  allFilmsContainer.innerHTML = ''
  generateImgs(results, allFilmsContainer)
}

export { updateSelectGenre }