import Dexie from "dexie";

// Type
import DBFavorite from "./type/DBFavorite";
import DBRecent from "./type/DBRecent";

/**
 * Indexed DB wrapper
 */
const db = new Dexie("QNB");

// Declare tables, IDs and indexes
db.version(1).stores({
  recent: "_id, added",
  favorites: "_id, added",
});
const recentTable = db.table<DBRecent>("recent");
const favoritesTable = db.table<DBFavorite>("favorites");

export { db, recentTable, favoritesTable };
