
export interface IStatisticsFeature {
  type: string,
  id: string,
  geometry: {
    type: string,
    coordinates: [number, number]
  },
  properties: {
    AAR: string,
    ANTALL: number,
    OPPDATERT: string,
    VEGKATEGORI: string
  };
}

export interface IStatisticsFeatureProperties {
  AAR: string,
  ANTALL: number,
  OPPDATERT: string,
  VEGKATEGORI: string
};

export interface IStatisticsRow {
  year: string,
  E: number,
  F: number,
  R: number,
  other: number
}
