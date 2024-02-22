import { doom } from "./doom.js";

const langSelect = () => {
  const lang = localStorage.getItem('lang')

  return lang 
    ? localStorage.getItem('lang')
    : navigator.language || 'en-US';
}
const languageOptions = doom.languageOptions
const language = () => {
  let lang = langSelect()

  languageOptions.addEventListener("change", (e) => {
    lang = e.target.value

    location.reload()
    localStorage.setItem('lang', e.target.value )
  });
  
  languageOptions.value = lang
  localStorage.setItem('lang', lang )
  return lang
}

export { language }