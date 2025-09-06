export enum ContentCategory {
  MOVIE = "фильмы",
  SERIAL = "сериалы",
  CARTOON = "мультфильмы",
  ANIME = "аниме",
  ANIME_SERIAL = "аниме сериалы",
}

export enum ContentType {
  FOREIGN_MOVIE = "foreign-movie",
  SOVIET_CARTOON = "soviet-cartoon",
  FOREIGN_CARTOON = "foreign-cartoon",
  RUSSIAN_CARTOON = "russian-cartoon",
  ANIME = "anime",
  RUSSIAN_MOVIE = "russian-movie",

  CARTOON_SERIAL = "cartoon-serial",
  DOCUMENTARY_SERIAL = "documentary-serial",
  RUSSIAN_SERIAL = "russian-serial",
  FOREIGN_SERIAL = "foreign-serial",
  ANIME_SERIAL = "anime-serial",
  MULTI_PART_FILM = "multi-part-film",
}

export enum Genre {
  ANIME = "аниме",
  BIOGRAPHY = "биография",
  ACTION = "боевик",
  WESTERN = "вестерн",
  WAR = "военный",
  DETECTIVE = "детектив",
  CHILDREN = "детский",
  ADULT = "для взрослых",
  DOCUMENTARY = "документальный",
  DRAMA = "драма",
  HISTORY = "история",
  COMEDY = "комедия",
  SHORT = "короткометражка",
  CRIME = "криминал",
  MELODRAMA = "мелодрама",
  MUSIC = "музыка",
  CARTOON = "мультфильм",
  MUSICAL = "мюзикл",
  ADVENTURE = "приключения",
  FAMILY = "семейный",
  SPORT = "спорт",
  THRILLER = "триллер",
  HORROR = "ужасы",
  SCI_FI = "фантастика",
  FILM_NOIR = "фильм-нуар",
  FANTASY = "фэнтези",
  GAME = "игра",
  REALITY_TV = "реальное тв",
  TALK_SHOW = "ток-шоу",
}

export const CategoryGenres: Record<ContentCategory, Genre[]> = {
  [ContentCategory.MOVIE]: [
    Genre.ANIME, Genre.BIOGRAPHY, Genre.ACTION, Genre.WESTERN, Genre.WAR,
    Genre.DETECTIVE, Genre.CHILDREN, Genre.ADULT, Genre.DOCUMENTARY,
    Genre.DRAMA, Genre.HISTORY, Genre.COMEDY, Genre.SHORT, Genre.CRIME,
    Genre.MELODRAMA, Genre.MUSIC, Genre.CARTOON, Genre.MUSICAL,
    Genre.ADVENTURE, Genre.FAMILY, Genre.SPORT, Genre.THRILLER,
    Genre.HORROR, Genre.SCI_FI, Genre.FILM_NOIR, Genre.FANTASY,
  ],

  [ContentCategory.SERIAL]: [
    Genre.BIOGRAPHY, Genre.ACTION, Genre.WESTERN, Genre.WAR,
    Genre.DETECTIVE, Genre.CHILDREN, Genre.DOCUMENTARY, Genre.DRAMA,
    Genre.HISTORY, Genre.COMEDY, Genre.SHORT, Genre.CRIME, Genre.MELODRAMA,
    Genre.CARTOON, Genre.MUSICAL, Genre.ADVENTURE, Genre.FAMILY, Genre.SPORT,
    Genre.THRILLER, Genre.HORROR, Genre.SCI_FI, Genre.FANTASY,
    Genre.GAME, Genre.REALITY_TV, Genre.TALK_SHOW,
  ],

  [ContentCategory.CARTOON]: [
    Genre.CHILDREN, Genre.DRAMA, Genre.HISTORY, Genre.COMEDY,
    Genre.SHORT, Genre.CARTOON, Genre.MUSICAL, Genre.ADVENTURE,
    Genre.FAMILY, Genre.SPORT, Genre.THRILLER, Genre.HORROR,
    Genre.SCI_FI, Genre.FANTASY, Genre.ANIME,
  ],

  [ContentCategory.ANIME]: [
    Genre.ANIME, Genre.BIOGRAPHY, Genre.ACTION, Genre.WESTERN, Genre.WAR,
    Genre.DETECTIVE, Genre.CHILDREN, Genre.ADULT, Genre.DRAMA,
    Genre.HISTORY, Genre.COMEDY, Genre.SHORT, Genre.CRIME,
    Genre.MELODRAMA, Genre.MUSIC, Genre.CARTOON, Genre.MUSICAL,
    Genre.ADVENTURE, Genre.FAMILY, Genre.SPORT, Genre.THRILLER,
    Genre.HORROR, Genre.SCI_FI, Genre.FILM_NOIR, Genre.FANTASY,
  ],

  [ContentCategory.ANIME_SERIAL]: [
    Genre.ANIME, Genre.BIOGRAPHY, Genre.ACTION, Genre.WESTERN, Genre.WAR,
    Genre.DETECTIVE, Genre.CHILDREN, Genre.ADULT, Genre.DRAMA,
    Genre.HISTORY, Genre.COMEDY, Genre.SHORT, Genre.CRIME,
    Genre.MELODRAMA, Genre.MUSIC, Genre.CARTOON, Genre.MUSICAL,
    Genre.ADVENTURE, Genre.FAMILY, Genre.SPORT, Genre.THRILLER,
    Genre.HORROR, Genre.SCI_FI, Genre.FILM_NOIR, Genre.FANTASY,
  ],
};

export const ContentTypeToCategory: Record<ContentType, ContentCategory> = {
  [ContentType.FOREIGN_MOVIE]: ContentCategory.MOVIE,
  [ContentType.RUSSIAN_MOVIE]: ContentCategory.MOVIE,

  [ContentType.DOCUMENTARY_SERIAL]: ContentCategory.SERIAL,
  [ContentType.RUSSIAN_SERIAL]: ContentCategory.SERIAL,
  [ContentType.FOREIGN_SERIAL]: ContentCategory.SERIAL,
  [ContentType.MULTI_PART_FILM]: ContentCategory.SERIAL,

  [ContentType.SOVIET_CARTOON]: ContentCategory.CARTOON,
  [ContentType.FOREIGN_CARTOON]: ContentCategory.CARTOON,
  [ContentType.RUSSIAN_CARTOON]: ContentCategory.CARTOON,
  [ContentType.CARTOON_SERIAL]: ContentCategory.CARTOON,
  
  [ContentType.ANIME]: ContentCategory.ANIME,
  [ContentType.ANIME_SERIAL]: ContentCategory.ANIME_SERIAL,
};
