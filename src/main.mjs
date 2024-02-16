import { settings } from "./settings.js";
import { navigation } from "./navigation.js";
import {
  doom,
  doomAll
} from "./doom.js";

const API = axios.create({
  baseURL: settings.API_URL,
  headers: { Authorization: `Bearer ${settings.API_AUTHORIZATION}` },
});

const options = {
  method: "GET",
  headers: { Authorization: `Bearer ${settings.API_AUTHORIZATION}` },
};

const timeWindow = "day";
const genresList = ["Series", "Films"];
const categoriesList = {}

// Obtener la visualicacion de las peliculas populares
const getMoviesTrendingPreview = async () => {
  const trendingEntries = doom.trendingEntries
  const trendingBullets = doom.trendingBullets

  const { data } = await API(`/trending/movie/${timeWindow}`);
  const movies = data.results;

  let view = 0;

  movies.forEach((data, index) => {
    if (index % 2 !== 0) {
      view++;

      const listItem = document.createElement("li");
      const linkItem = document.createElement("a");
      linkItem.name = `carousel_${view.toString().padStart(2, "0")}`;

      const images = (index) => {
        const image = document.createElement("img");
        image.className = "image";
        image.id = `trending_${index}`;
        image.src = `${settings.IMAGE_URL}${movies[index].poster_path}`;
        image.alt = movies[index].title;
        image.draggable = false;
        image.value = data.id
        image.setAttribute("popovertarget", "popover");
        return image
      }

      const img1 = images( index - 1)
      const img2 = images( index)


      linkItem.append(img1, img2);
      listItem.append(linkItem);
      trendingEntries.append(listItem);

      const listBullet = document.createElement("li");
      const linkBullet = document.createElement("a");
      linkBullet.href = `#carousel_${view.toString().padStart(2, "0")}`;

      listBullet.append(linkBullet);
      trendingBullets.append(listBullet);
    }
  });

  addTrendingEventListener();
};
getMoviesTrendingPreview();

// Obtener la visualizacion de los generos y categorias
const renderGenres = () => {
  genresList.forEach((element) => {
    const contentSummary = doom.contentSummary
    const genre = document.createElement("p");
    genre.textContent = element;
    contentSummary.append(genre);
  });
  addGenreEventListeners();
};

const renderCategories = async () => {
  const contentCategories = doom.contentCategories
  const response = await fetch(
    `${settings.API_URL}/genre/movie/list?`,
    options
  );
  const data = await response.json();
  data.genres.forEach((element) => {
    const category = document.createElement("p");
    category.textContent = element.name;
    contentCategories.append(category);
    categoriesList[element.name] = element.id
  });

  updateSelectGenre()
  addCategoryEventListeners();
};

// Agregar un escuchador para determinar que genero o categorias que se selecciono

// Genero
const addGenreEventListeners = () => {
  const genreElements = doomAll.genreElements()
  const genreSelect = doom.genreSelect

  genreElements.forEach((p) => {
    p.addEventListener("click", (e) => {
      const genre = e.target.textContent;
      if (genresList.includes(genre)) {
        genreSelect.textContent = genre;
        updateSelectGenre()
      }
    });
  });

};

// Categoria
const addCategoryEventListeners = () => {
  const categoryElements = doomAll.categoryElements()
  const categorySelect = doom.categorySelect

  categoryElements.forEach((p) => {
    p.addEventListener("click", (e) => {
      e.stopPropagation();
      const category = e.target.textContent;
      categorySelect.textContent = category;
      updateSelectGenre()

    });
  });
};

// Trending
const addTrendingEventListener = () => {
  const trendingElements = doomAll.trendingElements()
  const popover = doom.popover 

  trendingElements.forEach((img) => {
    img.addEventListener("click", (e) => {
      const id = img.value
      popover.showPopover();
      location.hash = `filmPreview_${img.value}`
      renderFilmPreview(id)
    });
  });
};

renderGenres();
renderCategories();

// Navegacion entre paginas
window.addEventListener("DOMContentLoaded", navigation, false);
window.addEventListener("hashchange", navigation, false)

// Ir a todas las peliculas
const allFilmsButton = doomAll.allFilms()

allFilmsButton.forEach((film) => {
  film.addEventListener('click' , () => {
    location.hash = "#allFilms"
  })
})

// Devolverse
const navbar = doom.navbar
const returnPopover = doom.returnPopover
const returnHash = doomAll.returnHash() 

navbar.addEventListener('click', () => {
  location.hash = "#home"
})
returnPopover.addEventListener('click' , () => {
  history.back();
})
returnHash.forEach((hash) => {
  hash.addEventListener('click' , () => {
    history.back();
  })
})


// Busqueda
const search = doom.search

search.addEventListener('click' , () => {
  location.hash = "#searchFilms"
})

// Detalle de la pelicula 
const play = doomAll.play()

play.forEach((playFilm) => {
  playFilm.addEventListener('click' , () => {
    // location.hash = "filmDetails"
  })
})

// allFilms

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

const renderFilmsGenre = async () => {
  const [genreData , category] = genre.value.split('/ ')
  const id = categoriesList[category]
  const dataQuery = await API('discover/movie', {
    params: {
      with_genres: id,
    },
  });
  const results = dataQuery.data.results

  filmsGenrePrevius(results)
  filmsGenreContent(results)

}

const generateImgs = (value, container) => {
  value.forEach((data) => {
    const img = document.createElement('img');
    const poster = data.poster_path === null 
      ? settings.IMAGE_NOT_FOUND 
      : `${settings.IMAGE_URL}${data.poster_path}`
    const id = data.id
    img.src = poster;
    img.alt = data.title;
    img.draggable = false;
    img.className = 'image';
    img.value = id
    img.addEventListener("click", (e) => {
      popover.showPopover();
      location.hash = `filmPreview_${id}`
      renderFilmPreview(id)
    });
    container.append(img);
  });
} 

const filmsGenrePrevius =  (results) => {
  const genreContent = doom.genreContent
  genreContent.innerHTML = ''

  const minData = results.slice(0, 6);
  generateImgs(minData, genreContent)
}
const filmsGenreContent = (results) => {
  const allFilmsTitle = doom.allFilmsTitle
  const allFilmsContainer = doom.allFilmsContainer
  allFilmsTitle.textContent = genre.value
  allFilmsContainer.innerHTML = ''
  generateImgs(results, allFilmsContainer)

}

const renderFilmsTrending = async () => {
  const { data } = await API(`/trending/movie/${timeWindow}`);
  const movies = data.results;
  
  const allFilmsTitle = doom.allFilmsTitle
  const allFilmsContainer = doom.allFilmsContainer
  allFilmsTitle.textContent = trending.value
  allFilmsContainer.innerHTML = ''

  generateImgs(movies, allFilmsContainer)
}

trending.addEventListener('click' , () => {
  renderFilmsTrending()
})

genre.addEventListener('click' , () => {
  renderFilmsGenre()
})

// Search render
const searchFormInput = doom.searchFormInput
const searchButton = doom.searchButton

searchButton.addEventListener('click' , () => {
  location.hash = `#searchFilms_${searchFormInput.value}`
  renderFilmsBySearch(searchFormInput.value)
})

const renderFilmsBySearch = async (value) =>  {
  const { data } = await API('search/movie',{
    params : {
      'query' : value
    }
  })

  const searchContainer = doom.searchContainer
  searchContainer.innerHTML = ''
  generateImgs(data.results, searchContainer)

}

const goBackElement = () => {
  const value = decodeURI(location.hash.split("_")[1]);
  if (value !== 'undefined') {
    searchFormInput.value = value
    renderFilmsBySearch(searchFormInput.value)
  } else {
    searchFormInput.value = ''
    renderFilmsBySearch(searchFormInput.value)
  }
}

// filmPreview

const renderFilmPreview = async (id) => {
  
  const { data } = await API('movie/' + id)

  const detailsImg = doom.detailsImg
  detailsImg.innerHTML = ''

  const img = document.createElement('img')
  const poster = data.poster_path === null ? settings.IMAGE_NOT_FOUND  : `${settings.IMAGE_URL}${data.poster_path}`
  img.src = poster
  img.className = 'image'
  img.alt = data.title
  detailsImg.append(img)

  doom.detailsTitle.textContent = data.title
  doom.detailsReview.textContent = data.vote_average
  doom.detailsDescription.textContent = data.overview


  const detailsCategories = doom.detailsCategories
  detailsCategories.innerHTML = ''
  data.genres.forEach((element) => {
    const genre = document.createElement('li')
    genre.textContent = element.name
    detailsCategories.append(genre)
  })

  renderFilmsSimilar(id)
}

const renderFilmsSimilar = async (id) => {
  const { data } = await API(`movie/${id}/similar`)
  const results = data.results
  const detailsFilmsSimilar = doom.detailsFilmsSimilar
  detailsFilmsSimilar.innerHTML = ''
  generateImgs(results, detailsFilmsSimilar)
}

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