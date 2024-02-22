import { filmsFavorites } from "../async/filmsFavorites.js"


const likedFilmsList = () => {
  const item = localStorage.getItem('likedFilm')

  return item 
    ? localStorage.getItem('likedFilm')
    : '{}'
}

const likeFilm = (movie) => {
  const likedFilms = JSON.parse(likedFilmsList())
  if (movie.id === undefined) { return }
  if (likedFilms[movie.id]) {
    delete likedFilms[movie.id]
  } else {
    likedFilms[movie.id] = movie
  }

  localStorage.setItem('likedFilm' , JSON.stringify(likedFilms))
  filmsFavorites(JSON.parse(localStorage.getItem('likedFilm')))
}

const activeFilmsFavorites = () => {
  const likedFilms = JSON.parse(localStorage.getItem('likedFilm'))
  filmsFavorites(likedFilms)
}

window.addEventListener("DOMContentLoaded", activeFilmsFavorites, false);

export { likeFilm , likedFilmsList }