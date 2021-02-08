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
  versionNumber: 'Versjonsnummer: 1.0.2',
  contact: 'Kontakt:  ',
  email: 'vegbilder@vegvesen.no',
  text:
    'Vegbilder viser vegbilder av Europa- og riksveger via en kartløsning. Hvert år blir det tatt millioner av vegbilder i Norge, ' +
    'og nå er mange av disse tilgjengeliggjort på nett. Bildene blir anonymisert før publisering slik at hverken mennesker eller kjøretøy er gjengjenbare. ' +
    'Bilder blir lagt ut etterhvert som de tas. Til nå er årgangene 2019 og 2020 tilgjengelig, samt noen enkelte bilder fra andre år. Eldre årganger er planlagt, men på grunn av antallet vil det ta litt tid før de er klare.',
  text2:
    'Vegbilder vil bli oppdatert fortløpende med ny funksjonalitet og forbedringer. Dersom du har forslag til forbedringer eller har oppdaget feil, kan du gjerne rapportere det til mailen under.',
};

export { reportEmailTemplateText, contactEmailTemplateText, informationText };
