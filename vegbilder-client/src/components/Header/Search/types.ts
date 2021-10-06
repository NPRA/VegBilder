export interface IGeonorgeResponse {
  metadata: Metadata;
  navn:     IStedsnavn[];
}

export interface Metadata {
  treffPerSide:      number;
  side:              number;
  totaltAntallTreff: number;
  viserFra:          number;
  viserTil:          number;
  sokeStreng:        string;
}

export interface IStedsnavn {
  skrivemåte:           string;
  skrivemåtestatus:     string;
  navnestatus:          string;
  språk:                string;
  navneobjekttype:      string;
  stedsnummer:          number;
  stedstatus:           string;
  representasjonspunkt: IRepresentasjonspunkt;
  fylker:               IFylker[];
  kommuner:             IKommuner[];
}

export interface IFylker {
  fylkesnavn:   string;
  fylkesnummer: string;
}

export interface IKommuner {
  kommunenummer: string;
  kommunenavn:   string;
}

export interface IRepresentasjonspunkt {
  øst:      number;
  nord:     number;
  koordsys: number;
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
