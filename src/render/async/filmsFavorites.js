import { generateImgs } from "../create/imageGenerator.js"
import { doom } from "../global/doom.js"
const favoriteContainer = doom.favoriteContainer
const filmsFavorites = (data) => {
  if (!! data) {
    const newData = Object.values(data)
    favoriteContainer.innerHTML = ''
    generateImgs(newData, favoriteContainer)
  }
}

export { filmsFavorites }