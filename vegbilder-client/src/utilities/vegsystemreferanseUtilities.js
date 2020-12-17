/*
const regexParts = {
  vegkategori: "[ERFerf]",
  vegstatus: "[VAPFvapf]",
  vegnuMmer: "\\d{1,5}",
  strekningsnuMmer: "\\d{1,3}",
  delstrekningsnuMmer: "\\d{1,5}",
  meter: "\\d{1,5}",
  kryssEllerSideanlegg: "K|S",
  kryssEllerSideanleggNuMmer: "d{1,2}",
};
*/

const regexpVegsystemreferanseWithKryssOrSideanlegg = /^([ERFerf])([VAPFvapf])(\d{1,5})\s?[Ss](\d{1,3})\s?[Dd](\d{1,3})\s?[Mm](\d{1,5})\s?([KSks])[Dd](\d{1,2})\s?[Mm](\d{1,5})/;
const regexpVegsystemreferanseWithKryssOrSideanleggWithoutMeter = /^([ERFerf])([VAPFvapf])(\d{1,5})\s?[Ss](\d{1,3})\s?[Dd](\d{1,3})\s?[Mm](\d{1,5})\s?([KSks])[Dd](\d{1,2})/;
const regexpVegsystemreferanse = /^([ERFerf])([VAPFvapf])(\d{1,5})\s?[Ss](\d{1,3})\s?[Dd](\d{1,3})\s?[Mm](\d{1,5})/;
const regexpVegsystemreferanseWithoutMeter = /^([ERFerf])([VAPFvapf])(\d{1,5})\s?[Ss](\d{1,3})\s?[Dd](\d{1,3})/;
const regexpVegsystemreferanseWithoutDelstrekning = /^([ERFerf])([VAPFvapf])(\d{1,5})\s?[Ss](\d{1,3})/;
const regexpVegsystemreferanseWithoutStrekning = /^([ERFerf])([VAPFvapf])(\d{1,5})/;

function matchAndPadVegsystemreferanse(text) {
  const trimmedText = text.trim();
  let matches;
  if (regexpVegsystemreferanseWithKryssOrSideanlegg.test(trimmedText)) {
    matches = trimmedText.match(regexpVegsystemreferanseWithKryssOrSideanlegg);
    return `${matches[1]}${matches[2]}${matches[3]} S${matches[4]}D${matches[5]} m${matches[6]} ${matches[7]}D${matches[8]} m${matches[9]}`;
  } else if (
    regexpVegsystemreferanseWithKryssOrSideanleggWithoutMeter.test(trimmedText)
  ) {
    matches = trimmedText.match(
      regexpVegsystemreferanseWithKryssOrSideanleggWithoutMeter
    );
    return (
      `${matches[1]}${matches[2]}`.toUpperCase() +
      `${matches[3]} S${matches[4]}D${matches[5]} m${matches[6]} ${matches[7]}D${matches[8]} m1`
    );
  } else if (regexpVegsystemreferanse.test(trimmedText)) {
    matches = trimmedText.match(regexpVegsystemreferanse);
    return (
      `${matches[1]}${matches[2]}`.toUpperCase() +
      `${matches[3]} S${matches[4]}D${matches[5]} m${matches[6]}`
    );
  } else if (regexpVegsystemreferanseWithoutMeter.test(trimmedText)) {
    matches = trimmedText.match(regexpVegsystemreferanseWithoutMeter);
    return (
      `${matches[1]}${matches[2]}`.toUpperCase() +
      `${matches[3]} S${matches[4]}D${matches[5]} m1`
    );
  } else if (regexpVegsystemreferanseWithoutDelstrekning.test(trimmedText)) {
    matches = trimmedText.match(regexpVegsystemreferanseWithoutDelstrekning);
    return (
      `${matches[1]}${matches[2]}`.toUpperCase() +
      `${matches[3]} S${matches[4]}D1 m1`
    );
  } else if (regexpVegsystemreferanseWithoutStrekning.test(trimmedText)) {
    matches = trimmedText.match(regexpVegsystemreferanseWithoutStrekning);
    return `${matches[1]}${matches[2]}`.toUpperCase() + `${matches[3]} S1D1 m1`;
  }
  return null;
}

export { matchAndPadVegsystemreferanse };
