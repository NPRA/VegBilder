import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Norsk
import commonNo from 'constants/text/norsk/common.json';
import dailyInfoNo from 'constants/text/norsk/dailyInfo.json';
import imageViewNo from 'constants/text/norsk/imageView.json';
import mapViewNo from 'constants/text/norsk/mapView.json';
import pageInformationNo from 'constants/text/norsk/pageInformation.json';
import snackbarNo from 'constants/text/norsk/snackbar.json';

// Engelsk
import commonEn from 'constants/text/english/common.json';
import dailyInfoEn from 'constants/text/english/dailyInfo.json';
import imageViewEn from 'constants/text/english/imageView.json';
import mapViewEn from 'constants/text/english/mapView.json';
import pageInformationEn from 'constants/text/english/pageInformation.json';
import snackbarEn from 'constants/text/english/snackbar.json';

const resources = {
  no: {
    common: commonNo,
    dailyInfo: dailyInfoNo,
    imageView: imageViewNo,
    mapView: mapViewNo,
    pageInformation: pageInformationNo,
    snackbar: snackbarNo
  },
  en: {
    common: commonEn,
    dailyInfo: dailyInfoEn,
    imageView: imageViewEn,
    mapView: mapViewEn,
    pageInformation: pageInformationEn,
    snackbar: snackbarEn
  }
}

i18n.use(initReactI18next).init({
  lng: 'no-NO',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});