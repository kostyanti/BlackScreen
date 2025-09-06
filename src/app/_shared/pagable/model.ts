export interface Material_data {
    title: string;
    anime_title: string;
    title_en: string;
    other_titles: string[];
    other_titles_en: string[];
    other_titles_jp: string[];
    anime_kind: string;
    all_status: string;
    anime_status: string;
    year: number;
    description: string;
    anime_description: string;
    poster_url: string;
    anime_poster_url: string;
    screenshots: string[];
    duration: number;
    countries: string[];
    all_genres: string[];
    genres: string[];
    anime_genres: string[];
    anime_studios: string[];
    kinopoisk_rating: number;
    kinopoisk_votes: number;
    imdb_rating: number;
    imdb_votes: number;
    shikimori_rating: number;
    shikimori_votes: number;
    premiere_world: string;
    aired_at: string;
    rating_mpaa: string;
    inimal_age: number;
    episodes_total: number;
    episodes_aired: number;
    actors: string[];
    directors: string[];
    producers: string[];
    writers: string[];
    composers: string[];
    editors: string[];
    designers: string[];
    operators: string[];
}
export interface Result {
    id: string;
    type: string;
    link: string;
    title: string;
    title_orig: string;
    other_title: string;
    translation: Translation;
    year: number;
    kinopoisk_id: string;
    imdb_id: string;
    worldart_link: string;
    shikimori_id: string;
    quality: string;
    camrip: boolean;
    lgbt: boolean;
    created_at: string;
    updated_at: string;
    material_data: Material_data;
    screenshots: string[];
}

export interface Translation {
    id: number;
    title: string;
    type: string;
}

export interface Root {
    time: string;
    total: number;
    prev_page: string;
    next_page: string;
    results: Result[];
}
