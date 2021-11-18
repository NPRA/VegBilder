import { settings } from './settings';

export const REPORT_ERROR_SCHEME_URL =
  'https://forms.office.com/Pages/ResponsePage.aspx?id=VGmFOFXt90mL3XOP-7_TkIgX88vaXV9Notkd5xXWTp5UNUFGVlQ1MVRHT1E5SzI5UEdMRTlLSUhOUyQlQCN0PWcu';

export const FEEDBACK_SCHEME_URL =
  'https://forms.office.com/Pages/ResponsePage.aspx?id=VGmFOFXt90mL3XOP-7_TkIgX88vaXV9Notkd5xXWTp5UOVIzNlE0T1hMUVk0N1ZDSzVIMkcyTk84VCQlQCN0PWcu';

export const VEGBILDER_OGC_UTV = 'https://www.utv.vegvesen.no/kart/ogc/vegbilder_1_0/ows';

export const VEGBILDER_OGC = 'https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows';

export const VEGKART = 'https://vegkart.atlas.vegvesen.no/#kartlag:geodata/';

export const WSGEONORGE = 'https://ws.geonorge.no/';

export const NVDBAPI = 'https://nvdbapiles-v3.atlas.vegvesen.no/';

export const OGC_URL =
  // process.env.NODE_ENV === 'development' || settings.productionMode
  //   ? VEGBILDER_OGC
  //   :
  VEGBILDER_OGC_UTV;
