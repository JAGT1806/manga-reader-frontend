export interface ListMangasResponse {
    message: string;
    data: Manga[];
    limit: number;
    offset: number;
    total: number;
}

export interface MangaResponse {
    message: string;
    data: Manga;
}

export interface Manga {
    id: string;
    title: string;
    image: string;
    description: {[key: string]: string};
    coverId: string;
    fileName: string;
    coverUrl?: string;
}

export interface FeedMangaResponse {
    message: string;
    data: ChapterFeed[];
    limit: number;
    offset: number;
    total: number;
}

export interface ChapterFeed {
    id: string;
    atributos: ChapterAttributes;
}

export interface ChapterAttributes {
    volumen: string;
    capitulo: string;
    titulo: string;
    idioma: string;
    paginas: number;
}

export interface ChapterMangaResponse {
    message: string;
    data: string[];      // URLs de las imágenes en calidad normal
    dataSaver: string[]; // URLs de las imágenes en calidad reducida
}