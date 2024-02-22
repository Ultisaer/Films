import { settings } from "../../settings.js";
import { renderFilmPreview } from "../async/filmPreview.js";
import { loadLazyImages } from "../observer/observer.js"
import { likeFilm , likedFilmsList} from "../global/localStorage.js";

// Función para obtener la URL del póster.
const getPosterUrl = (data) => data.poster_path ? settings.IMAGE_URL + data.poster_path : settings.IMAGE_NOT_FOUND;

// Función para configurar la carga perezosa de las imágenes.
const setLazyLoading = (img, poster, isLazy) => {
  if (isLazy) {
    img.setAttribute('data-src', poster);
  } else {
    img.src = poster;
  }
}

// Función para agregar un evento de clic a una imagen.
const addClickEventListener = (img, hashName) => {
  img.addEventListener("click", () => {
    popover.showPopover();
    location.hash = hashName;
    renderFilmPreview(img.value);
  });
}

// Función para crear un elemento de imagen y configurarlo.
const createImageElement = ({ data, isLazy = true }) => {
  const img = document.createElement('img');
  
  img.alt = data.title;
  img.draggable = false;
  img.className = 'image';
  img.value = data.id;
  img.setAttribute("popovertarget", "popover");

  const poster = getPosterUrl(data);
  setLazyLoading(img, poster, isLazy);
  
  return img;
}

const createButtonElement = (data) => {
  const button = document.createElement('button');
  const img = document.createElement('img');
  img.src = './media/hearth.svg'; // Imagen inicial
  button.className = 'favorite_button';
  button.append(img);
  buttonEvent(button, img, data);
  return button;
}

const parseListLiked = JSON.parse(likedFilmsList())

const buttonEvent = (button, img, data) => {
  if (parseListLiked[data.id] !== undefined) {
    img.src = './media/hearthSelect.svg'
    button.classList.add('favorite_button-liked');
  }

  button.addEventListener('click', () => {
    button.classList.toggle('favorite_button-liked');
    
    button.classList.contains('favorite_button-liked')
      ? img.src = './media/hearthSelect.svg'
      : img.src = './media/hearth.svg';
    likeFilm(data)
  });
}
// Función para generar imágenes y agregarlas a un contenedor.
const generateImgs = (value, container, isLazy = true) => {
  value.forEach((data) => {
    const div = document.createElement('div')
    const img = createImageElement({ data, isLazy });
    const button = createButtonElement(data)
    div.style.position = 'relative'
    div.append(img);
    div.append(button);
    container.append(div)
    addClickEventListener(img, `filmPreview_${data.id}`);
    if (isLazy) loadLazyImages.observe(img);
  });
}

// Función para generar un carrusel de imágenes.
const generateImgsCarousel = (values, entries, bullets) => {
  let view = 0;

  values.forEach((_, index) => {
    if (index % 2 !== 0) {
      view++;

      const listItem = document.createElement("li");
      const linkItem = document.createElement("a");
      linkItem.name = `carousel_${view.toString().padStart(2, "0")}`;

      const createImage = (index) => {
        const data = values[index];
        const img = createImageElement({ data });
        addClickEventListener(img, `filmPreview_${data.id}`);
        loadLazyImages.observe(img);
        return img;
      }

      const img1 = createImage(index - 1);
      const img2 = createImage(index);

      linkItem.append(img1, img2);
      listItem.append(linkItem);
      entries.append(listItem);

      const listBullet = document.createElement("li");
      const linkBullet = document.createElement("a");
      linkBullet.href = `#carousel_${view.toString().padStart(2, "0")}`;

      listBullet.append(linkBullet);
      bullets.append(listBullet);
    }
  });
}

export { generateImgs, generateImgsCarousel }
