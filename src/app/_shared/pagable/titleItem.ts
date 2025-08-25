export interface TitleItem {
  img: string;
  name: string;
  country: string;
  year: string;
  genre?: string;
  
  episode: number;
  season: number;
}

export const defaultTitleItem: TitleItem = {
  img: "",
  name: "",
  country: "",
  year: "",

  episode: 1,
  season: 1
}