const isDev = process.env.NODE_ENV === "development";

const DEV_URL = "http://127.0.0.1:3001";
const PROD_URL = "https://www.qiqis-notebook.com";
const API_URL = isDev ? DEV_URL + "/api" : PROD_URL + "/api";
const BASE_URL = isDev ? DEV_URL : PROD_URL;

export { isDev, API_URL, BASE_URL };
