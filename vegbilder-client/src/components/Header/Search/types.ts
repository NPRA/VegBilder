export interface IStedsnavn {
  ssrId: string;
  navnetype: string;
  kommunenavn: string;
  fylkesnavn: string;
  stedsnavn: string;
  aust: string;
  nord: string;
  skrivemaatestatus: string;
  spraak: string;
  skrivemaatenavn: string;
  epsgKode: string;
}

export interface IVegsystemData {
  vegsystemreferanse: {
    vegsystem: {
      id: number;
      versjon: number;
      vegkategori: string;
      fase: string;
      nummer: number;
    };
    strekning: {
      id: number;
      versjon: number;
      strekning: number;
      delstrekning: number;
      arm: false;
      adskilte_løp: string;
      trafikantgruppe: string;
      meter: number;
      retning: string;
    };
    kortform: string;
  };
  veglenkesekvens: {
    veglenkesekvensid: number;
    relativPosisjon: number;
    kortform: string;
  };
  geometri: {
    wkt: string;
    srid: number;
  };
  kommune: number;
}
