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
  state: Translatable;
  country: Translatable;
}

export interface Translatable {
  de: string;
  en?: string;
  abbreviation?: string;
}

export interface Gallery {
  url: string;
  path: string;
  caption: string;
  year: string;
}
