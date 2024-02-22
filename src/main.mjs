import { language } from "./render/global/localStorageLanguaje.js";
language()
import { settings } from "./settings.js";
import { navigation } from "./render/navigation/navigation.js";
import { doom, doomAll } from "./render/global/doom.js";
import { API , options } from "./render/global/configuration.js";
import { global } from "./render/global/vars.js";
import { renderGenres } from "./render/initial/genres.js";
// import { renderCategories } from "./render/initial/categories.js";
// import { loadLazyImages , loadMoreFilms} from "./render/observer/observer.js"
import { generateImgs , generateImgsCarousel } from "./render/create/imageGenerator.js"
const timeWindow = global.time
const genresList = global.genres
const categoriesList = global.categories

// Obtener la visualicacion de las peliculas populares


const getMoviesTrendingPreview = async () => {
  const entries = doom.trendingEntries
  const bullets = doom.trendingBullets
  const { data } = await API(`/trending/movie/${timeWindow}`);
  const movies = data.results;
  const filmRandom = Math.floor(Math.random() * movies.length)

  renderBanner(movies[filmRandom])
  generateImgsCarousel(movies, entries, bullets)
  addTrendingEventListener();
  doom.trendingCarouselLoader.style.display = 'none'
};

getMoviesTrendingPreview(); // RENDERIZADO_INICIAL

const renderBanner = (data) => {
  const fillBanner = doom.fillBanner
  fillBanner.innerHTML = ''
  generateImgs([data], fillBanner, true)
  genresBanner(data.genre_ids)
} 
const genresBanner = async (categories) => {
  const { data } = await API('/genre/movie/list')
  const fillBannerCategories = doom.fillBannerCategories
  categories.forEach((value) => {
    data.genres.forEach(({id, name}) => {
      if (id === value) {
        const p = document.createElement('p')
        p.innerText = name
        fillBannerCategories.append(p)
      }
    })
  })
}

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

renderCategories();

// Navegacion entre paginas
window.addEventListener("DOMContentLoaded", navigation, false);
window.addEventListener("hashchange", navigation, false)

// Ir a todas las peliculas
const allFilmsButton = doomAll.allFilms()

allFilmsButton.forEach((film) => {
  film.addEventListener('click' , () => {
    location.hash = "#allFilms" //L9
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

const renderFilmsTrending = async () => {
  const { data } = await API(`/trending/movie/${timeWindow}`);
  maxPage = data.total_pages
  const movies = data.results;
  
  const allFilmsTitle = doom.allFilmsTitle
  const allFilmsContainer = doom.allFilmsContainer
  allFilmsTitle.textContent = trending.value
  allFilmsContainer.innerHTML = ''

  generateImgs(movies, allFilmsContainer)
}

trending.addEventListener('click' , () => {
  renderFilmsTrending()
  location.hash = '#allFilms_Trending'
})

genre.addEventListener('click' , () => {
  renderFilmsGenre()
  location.hash = `#allFilms_Genre-${allFilms.textContent.split('/ ')[1]?.trim()}`
})

// Renderiza las peliculas con infinite scroll
let maxPage;
let page = 1;

const loadLazyImages = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute('data-src')
      entry.target.src = url
    }
  })
})

const loadMoreFilms = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      renderPaginatedFilms()
    }
  }) 
})

const loadMoreSearch = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      renderPaginatedFilms()
    }
  }) 
})
const endFilms = doom.endFilms
const endSearch= doom.endSearch

loadMoreFilms.observe(endFilms)
loadMoreSearch.observe(endSearch)

const renderPaginatedFilms = async () => {
  const allFilms = doom.allFilmsTitle
  const pageIsNotmAX = page < maxPage
  let type = ''
  if (location.hash === '#allFilms_Trending') {
    type = 'Trending'
  }
  else if (location.hash.startsWith('#searchFilms')) {
    type = 'Search'
  }
  else if (location.hash.startsWith('#allFilms_Genre')) {
    type = 'Genre'
  }
  if (!pageIsNotmAX) {
    console.log('Es el maximo chamo')
    return
  }

  if (type === 'Trending' && pageIsNotmAX) {
    const { data } = await API(`trending/movie/${timeWindow}`, {
      params: {
        page: page++
      }
    });

    const movies = data.results;
    const allFilmsTitle = doom.allFilmsTitle
    const allFilmsContainer = doom.allFilmsContainer
    allFilmsTitle.textContent = trending.value
    generateImgs(movies, allFilmsContainer)
  } 
  
  else if (type === 'Genre' && pageIsNotmAX) {
    const [_ , category] = allFilms.textContent.split('/ ')
    const id = categoriesList[category]
    const dataQuery = await API('discover/movie', {
      params: {
        with_genres: id,
        page: page++
      },
    });
    // console.log(dataQuery)
    const results = dataQuery.data.results
    const allFilmsTitle = doom.allFilmsTitle
    const allFilmsContainer = doom.allFilmsContainer
    allFilmsTitle.textContent = genre.value
    generateImgs(results, allFilmsContainer)
  }

  else if (type === 'Search' && pageIsNotmAX) {
    const searchFormInput = doom.searchFormInput

    const { data } = await API('search/movie',{
      params : {
        'query' : searchFormInput.value,
        page: page++
      }
    })
  
    const searchContainer = doom.searchContainer
    generateImgs(data.results, searchContainer)
  }

}

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