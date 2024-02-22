import { doom } from "../global/doom.js"
import { renderPaginatedFilms } from "../async/paginatedFilms.js"

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
const endFilms = doom.endFilms
loadMoreFilms.observe(endFilms)

export { loadLazyImages }