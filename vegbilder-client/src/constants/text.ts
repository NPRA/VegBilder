const reportEmailTemplateText = {
  emailAddress: 'vegbilder@vegvesen.no',
  subject: 'Melding om feil på vegbilde med id',
  body: {
    line1: 'Jeg vil melde fra om feil på følgende vegbilde:',
    line2: 'Beskrivelse: <Vennligst beskriv hva som er feil>',
  },
};

const contactEmailTemplateText = {
  emailAddress: 'vegbilder@vegvesen.no',
  subject: 'Tilbakemelding/kontakt',
};

const informationText = {
  header: 'Velkommen til Vegbilder',
  photoDescription: 'E6 ved Hjerkinn med Snøhetta i bakgrunnen.',
  photoBy: 'Foto: Knut Opeide, Statens Vegvesen',
  text1:
    'Vegbilder er en webbasert kartløsning for visning av vegbilder som tas årlig av Statens vegvesen. Bildene er anonymisert før publisering, slik at hverken mennesker eller kjøretøy skal være gjenkjennbare. ',
  text2:
    'Nye bilder blir tilgjengelig etter hvert som de tas. Til nå er årgangene 2019 og 2020 tilgjengelig. Eldre årganger er planlagt, men på grunn av antallet bilder vil det ta litt tid før de er klare.',
  text3:
    'Feil eller eventuelle forslag til løsningen formidles med egne skjema. Lenke til disse finnes under «Informasjon om Vegbilder» i øvre høyre hjørne, og for hvert enkelt bilde under ikonet "',
};

const helpText = {
  header1: 'Bruk av vegbilder',
  header2: 'Tilbakemelding',
  versionNumber: 'v1.1.8',
  text1:
    'For å finne bilder der du ønsker kan du enten zoome inn på kartet eller søke etter stedsnavn eller vegsystemreferanse. Når du har zoomet inn på en veg vil du få opp markører du kan klikke på for å se bildet. ',
  text2:
    'Dersom en vegstrekning er kjørt flere ganger i løpet av et år vil det dukke opp en datovelger ved årsvelgeren.',
  text3:
    'Ønsker du å dele et bilde kan du gjøre det på to måter. Enten kan du kopiere nettsideadressen (url) eller så kan du klikke på "',
  text3Cont: '" og trykke "Del".',
  text4: 'Med   ',
  text4Cont:
    '  (historieikonet) kan du finne bilder med samme lokasjon og kjøreretning på forskjellige datoer.',
  text5:
    'Feil eller forslag til løsningen formidles med egne skjema (lenke under). Feil for hvert enkelt bilde meldes under ikonet "',
};

const settingsText = {
  header: 'Innstillinger',
  onboarding: 'Vis velkomstmelding ved oppstart',
};

export {
  reportEmailTemplateText,
  contactEmailTemplateText,
  informationText,
  helpText,
  settingsText,
};
