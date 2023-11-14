const isDev = process.env.NODE_ENV === "development";

const DEV_URL = "http://127.0.0.1:3001";
const PROD_URL = "https://www.qiqis-notebook.com";
const BASE_URL = isDev ? DEV_URL : PROD_URL;
const API_URL = BASE_URL + "/api";

export { isDev, DEV_URL, PROD_URL, BASE_URL, API_URL };
