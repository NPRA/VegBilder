export interface IImagePoint {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  geometry_name: string;
  properties: {
    AAR: number;
    TIDSPUNKT: string;
    FYLKENUMMER: string;
    VEGKATEGORI: string;
    VEGSTATUS: string;
    VEGNUMMER: string | null;
    STREKNING: string;
    HP: string | null;
    DELSTREKNING: string;
    ANKERPUNKT: string | null;
    KRYSSDEL: string | null;
    SIDEANLEGGSDEL: string | null;
    METER: number;
    FELTKODE: string;
    REFLINKID: string;
    REFLINKPOSISJON: number;
    RETNING: number;
    URL: string;
    BASELINEINFO: string;
  };
}

export interface ILatlng {
  lat: number;
  lng: number;
}

export interface IBbox {
  east: number;
  west: number;
  north: number;
  south: number;
}

export type queryParamterNames = 'imageId' | 'year' | 'view' | 'lat' | 'lng' | 'zoom';

export type viewTypes = 'map' | 'image';
