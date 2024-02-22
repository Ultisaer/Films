const doom = {
  // Trending
  trendingEntries: document.querySelector(".trending_carousel-entries"),
  trendingBullets: document.querySelector(".trending_carousel-bullets"),

  // Banner 
  fillBanner: document.querySelector(".fillBanner_img"),
  fillBannerCategories : document.querySelector(".fillBanner_categories"),

  // List container genre category
  contentSummary: document.querySelector(".contentSummary"),
  contentCategories: document.querySelector(".contentSummary-categories"),
  genreSelect: document.querySelector(".genre_select-genre"),
  categorySelect: document.querySelector(".genre_select-categories"),

  // Popover
  popover: document.getElementById("popover"),

  // Inactive
  home: document.querySelector(".home"),
  filmBanner: document.querySelector(".filmBanner"),
  navbarCategories: document.querySelector(".navbar_categories"),
  allFilms: document.querySelector("#allFilms"),
  searchFilms: document.querySelector("#search"), 
  filmDetails: document.querySelector("#filmDetails"),
  navBar: document.querySelector('.navbar_container'),

  // Buton
  search: document.querySelector(".navbar_search"),
  navbar: document.querySelector(".navbar_logo-button"),
  
  // Dom od all films
  genre: document.querySelector(".genre_button"),
  trending: document.querySelector(".trending_button"),
  trendingTitle : document.querySelector(".trending_title"),
  selectGenre : document.querySelector(".genre_select-genre"),
  selectCategories : document.querySelector(".genre_select-categories"),
  genreContent : document.querySelector(".genre_content"),
  allFilmsTitle : document.querySelector(".allFilms_title"),
  allFilmsContainer : document.querySelector(".allFilms_container"),

  // Search
  searchFormInput : document.querySelector(".search_form-input"),
  searchButton : document.querySelector(".search_button"),
  searchContainer : document.querySelector(".search_container"),

  // Detail film preview
  detailsTitle : document.querySelector(".details_title"),
  detailsReview : document.querySelector(".details_review p"),
  detailsDescription : document.querySelector(".details_description p"),
  detailsCategories : document.querySelector(".details_categories ul"),
  detailsFilmsSimilar : document.querySelector(".details_filmsSimilar"),
  detailsImg : document.querySelector(".details_img"),
  returnPopover : document.querySelector(".return_popover"),

  // Loaders 
  loaderBanner: document.querySelector(".loaderBanner"),
  trendingCarouselLoader : document.querySelector(".trending_carousel-loader"),
  genreContentLoader : document.querySelector(".genre_content-loader "),

  // InfiniteScroll
  endFilms : document.querySelector("#endOfContentFilms"),
  endSearch : document.querySelector("#endOfContentSearch"),
  
  // Favorite 
  favoriteFilms : document.querySelector("#favoriteFilms"),
  favoriteContainer : document.querySelector(".favorite_gallery"),

  // Language 
  languageOptions : document.querySelector("#languageOptions")
};

const doomAll = {
  trendingElements: () =>  document.querySelectorAll(".trending_carousel-entries li a img"),
  genreElements: () =>  document.querySelectorAll(".genre_sections .contentSummary p"),
  categoryElements: () => document.querySelectorAll( ".genre_categories .contentSummary-categories p"),
  allFilms: () => document.querySelectorAll('.allFilms_button'),
  returnHash : () => document.querySelectorAll('.return_hash'),
  play : () => document.querySelectorAll(".button_play"),
}

export { doom , doomAll}