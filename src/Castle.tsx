export interface Castle {
  id: string;
  urls: string[];
  name: Name;
  slug: string;
  location: Location;
  classifications: Translatable[];
  structures: Translatable[];
}

export interface Name {
  primary: string;
  secondary: null | string;
}

export interface Location {
  city?: string;
  county?: string;
  region?: string;
  country: string;
}

export interface Translatable {
  de: string;
  en: string | null;
}

export interface Gallery {
  url: string;
  path: string;
  caption: string;
  year: string;
}
