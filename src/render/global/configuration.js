import { settings } from "../../settings.js";
import { language } from "./localStorageLanguaje.js";

const API = axios.create({
  baseURL: settings.API_URL,
  headers: {
    Authorization: `Bearer ${settings.API_AUTHORIZATION}`,
  },
  params: {
    "language": language()
  }
});

const options = {
  method: "GET",
  headers: { Authorization: `Bearer ${settings.API_AUTHORIZATION}` },
};

export { API, options };
