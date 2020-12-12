import { getShareableUrlForImage } from "./urlUtilities";

function createMailtoHrefForReporting(imagePoint) {
  const url = getShareableUrlForImage(imagePoint);
  const email = "trond.furstenberg@vegvesen.no";
  const subject = `Melding om feil på vegbilde med id '${imagePoint.id}'`;
  const body = `Jeg vil melde fra om feil på følgende vegbilde: ${url} \r\n\r\nBeskrivelse: <Vennligst beskriv hva som er feil>`;
  const mailto = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(
    body
  )}`;
  return mailto;
}

export { createMailtoHrefForReporting };
