import { generateImgs } from "../create/imageGenerator.js"
import { doom  } from "../global/doom.js"
import { API } from "../global/configuration.js"

const searchFilmsRender = async (value) =>  {
  const { data } = await API('search/movie',{
    params : {
      'query' : value
    }
  })

  const searchContainer = doom.searchContainer
  searchContainer.innerHTML = ''
  generateImgs(data.results, searchContainer)
}

export { searchFilmsRender }