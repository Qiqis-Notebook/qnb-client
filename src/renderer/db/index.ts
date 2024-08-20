import Dexie from "dexie";

// Type
import type DBFavorite from "./type/DBFavorite";
import type DBRecent from "./type/DBRecent";

/**
 * Indexed DB wrapper
 */
const db = new Dexie("QNB");

// Declare tables, IDs and indexes
db.version(1).stores({
  recent: "_id, added",
  favorites: "_id, added",
});
db.version(2)
  .stores({
    recent: "_id, added",
    favorites: "_id, added",
  })
  .upgrade((trans) => {
    trans
      .table<DBRecent>("recent")
      .toCollection()
      .modify((route) => {
        route.game = "Genshin";
      });
    return trans
      .table<DBFavorite>("favorites")
      .toCollection()
      .modify((favorite) => {
        favorite.game = "Genshin";
      });
  });
const recentTable = db.table<DBRecent>("recent");
const favoritesTable = db.table<DBFavorite>("favorites");

export { db, recentTable, favoritesTable };
