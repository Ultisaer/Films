import { API } from "../global/configuration.js"
import { doom } from "../global/doom.js"
import { settings } from "../../settings.js"
import { generateImgs } from "../create/imageGenerator.js"

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

export {renderFilmPreview}