export interface ListMangasResponse {
    message: string;
    data: Manga[];
    limit: number;
    offset: number;
    total: number;
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