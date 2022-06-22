import { Dictionary } from 'lodash';

/*
  URL: Url to the original image (only blurred)
  URLPREVIEW: Url to an optimised version of the original image more suitable for preview
*/
export interface IImagePoint {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  geometry_name: string;
  properties: {
    BILDETYPE: string;
    AAR: number;
    TIDSPUNKT: string;
    LAGRET_TID?: string;
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
    URLPREVIEW: string;
    BASELINEINFO: string;
    DETEKTERTEOBJEKTER: string | null;
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

export interface ILoadedImagePoints {
  imagePoints: IImagePoint[];
  bbox: IBbox;
  year: number;
  imagePointsGroupedBySeries?: Dictionary<Dictionary<IImagePoint[]>>;
  availableDates?: string[];
}

export type queryParameterNames =
  | 'imageId'
  | 'year'
  | 'view'
  | 'lat'
  | 'lng'
  | 'zoom'
  | 'vegsystemreferanse'
  | 'radius'
  | 'requester';

export type viewTypes = 'map' | 'image';

export type imageType = 'planar' | 'panorama' | 'all';
