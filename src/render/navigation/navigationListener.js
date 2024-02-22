import { navigation } from "./navigation.js";
import { doom, doomAll } from "../global/doom.js";
import { renderFilmPreview } from "../async/filmPreview.js";

const navigationListener = () => {

  window.addEventListener("DOMContentLoaded", navigation, false);
  window.addEventListener("hashchange", navigation, false);

  // Ir a todas las peliculas
  const allFilmsButton = doomAll.allFilms();

  allFilmsButton.forEach((film) => {
    film.addEventListener("click", () => {
      location.hash = "#allFilms";
    });
  });

  // Devolverse
  const navbar = doom.navbar;
  const returnPopover = doom.returnPopover;
  const returnHash = doomAll.returnHash();

  navbar.addEventListener("click", () => {
    location.hash = "#home";
  });
  returnPopover.addEventListener("click", () => {
    history.back();
  });
  returnHash.forEach((hash) => {
    hash.addEventListener("click", () => {
      history.back();
    });
  });

  // Busqueda
  const search = doom.search;
  search.addEventListener("click", () => {
    location.hash = "#searchFilms";
  });

  // Detalle de la pelicula
  const play = doomAll.play();
  play.forEach((playFilm) => {
    playFilm.addEventListener("click", () => {
      // location.hash = "filmDetails"
    });
  });

};
export { navigationListener };
