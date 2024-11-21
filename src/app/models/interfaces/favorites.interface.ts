export interface FavoritesRequest {
    idManga: string;
    userId: number;
    nameManga: string;
    urlImage: string;
  }
  
  export interface FavoriteDTO {
    idFavorites?: number;
    idManga: string;
    userId: number;
    nameManga: string;
    urlImage: string;
  }
  
  export interface ListFavoritesResponse {
    message: string;
    data: FavoriteDTO[];
    offset: number;
    limit: number;
    total: number;
  }