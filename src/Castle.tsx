export interface Castle {
  id: string;
  urls: string[];
  title: string;
  timeline: string;
  buildingDevelopment: string;
  buildingDescription: string;
  gallery: Gallery[];
  misc: any;
  country: string;
  state: string;
  region: string;
  county: string;
  city: string;
  structureType: string[];
  classification: string[];
  purpose: string[];
  overview: string;
  dateBegin: string;
  dateEnd: string;
  condition: string;
  conditionCommentary: string;
  references: string[];
}

export interface Gallery {
  url: string;
  caption: string;
  year: string;
}
