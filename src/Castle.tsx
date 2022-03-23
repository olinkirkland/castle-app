export default interface Castle {
  id: string;
  urls: string[];
  name: Name;
  slug: string;
  location: Location;
  classifications: Translatable[];
  structures: Translatable[];
  condition: Translatable;
  purpose: Translatable[];
  conditionCommentary: string;
  gallery: GalleryImage[];
  dates: { start: HistoryDate; end: HistoryDate };
}

export interface Name {
  primary: string;
  secondary: null | string;
}

export interface Location {
  city?: string;
  county?: string;
  region?: string;
  state: Translatable;
  country: Translatable;
}

export interface Translatable {
  de: string;
  en?: string;
  abbreviation?: string;
  value?: any;
}

export interface GalleryImage {
  url: string;
  path: string;
  caption: string;
  year: string;
}

export interface HistoryDate {
  century: number | null;
  half: number | null;
}
