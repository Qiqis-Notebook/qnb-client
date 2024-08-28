interface UserFavorite {
  user: string;
  route: string;
}
export interface FavoriteResponse {
  data: UserFavorite | null;
  dt: string;
}
export interface FavoriteDeleteResponse {
  data: boolean;
  dt: string;
}
