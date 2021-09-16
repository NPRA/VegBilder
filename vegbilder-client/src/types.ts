import { Dictionary } from 'lodash';

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
  cameraType: cameraTypes;
  imagePointsGroupedBySeries?: Dictionary<Dictionary<IImagePoint[]>>;
  availableDates?: string[];
}

export type queryParamterNames = 'imageId' | 'year' | 'view' | 'lat' | 'lng' | 'zoom' | 'vegsystemreferanse';

export type viewTypes = 'map' | 'image';

export type cameraTypes = 'planar' | '360' | 'dekkekamera';
