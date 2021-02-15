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
  versionNumber: 'Versjonsnummer: 1.0.5',
  contact: 'Kontakt: ',
  photoDescription: 'E6 ved Hjerkinn med Snøhetta i bakgrunnen.',
  photoBy: 'Foto: Knut Opeide, Statens Vegvesen',
  email: 'vegbilder@vegvesen.no',
  text1:
    'Vegbilder er en kartløsning for visning av vegbilder tatt av Statens vegvesen. Hvert år tas det millioner av vegbilder i Norge, og disse blir nå tilgjengeliggjort med denne løsningen. Bildene blir anonymisert før publisering, slik at hverken mennesker eller kjøretøy skal være gjenkjennbare. ',
  text2:
    'Nye bilder blir tilgjengelig etter hvert som de tas. Til nå er årgangene 2019 og 2020 tilgjengelig. Eldre årganger er planlagt, men på grunn av antallet bilder vil det ta litt tid før de er klare.',
  text3:
    'Feil eller eventuelle forslag til løsningen formidles med egne skjema. Lenke til disse finnes under «Informasjon om Vegbilder» i øvre høyre hjørne, og for hvert enkelt bilde under «۰۰۰». ',
  text4:
    'Feil eller eventuelle forslag til løsningen formidles med egne skjema. Du kan klikke på linken under for å gi tilbakemelding, eller melde feil for hvert enkelt bilde under «۰۰۰».',
};

export { reportEmailTemplateText, contactEmailTemplateText, informationText };
