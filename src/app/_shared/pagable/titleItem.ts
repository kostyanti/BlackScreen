export interface TitleItem {
  img: string;
  name: string;
  shortInfo: string;
  
  episode: number;
  season: number;
  lasturl: string;
}

export const defaultTitleItem: TitleItem = {
  img: "",
  name: "",
  shortInfo: "",

  episode: 1,
  season: 1,
  lasturl: "",
}