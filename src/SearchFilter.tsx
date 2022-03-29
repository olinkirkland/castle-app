import Translatable from './Translatable';

export interface SearchFilter {
  name: string;
  includeSecondaryName: boolean;
  mustHaveImages: boolean;
  id: string;
  dateFrom: [number, number];
  dateTo: [number, number];
  classifications: Translatable[];
  purposes: Translatable[];
  structures: Translatable[];
}
