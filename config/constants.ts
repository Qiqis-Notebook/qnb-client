const isDev = process.env.NODE_ENV === "development";

// URLS
const DEV_URL = "http://127.0.0.1:3001";
const PROD_URL = "https://www.qiqis-notebook.com";
const BASE_URL = isDev ? DEV_URL : PROD_URL;
const API_URL = BASE_URL + "/api";
export { isDev, DEV_URL, PROD_URL, BASE_URL, API_URL };

// Constants
const MAIN_WIDTH = 1216;
const MAIN_HEIGHT = 733;
const MAIN_MIN_WIDTH = 1016;
const MAIN_MIN_HEIGHT = 733;
const ROUTE_WIDTH = 400;
const ROUTE_HEIGHT = 375;
const ROUTE_MIN_WIDTH = 400;
const ROUTE_MIN_HEIGHT = 375;
export {
  MAIN_WIDTH,
  MAIN_HEIGHT,
  MAIN_MIN_WIDTH,
  MAIN_MIN_HEIGHT,
  ROUTE_WIDTH,
  ROUTE_HEIGHT,
  ROUTE_MIN_WIDTH,
  ROUTE_MIN_HEIGHT,
};
