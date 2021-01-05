const reportEmailTemplateText = {
  emailAddress: 'vegbilder@vegvesen.no',
  subject: 'Melding om feil på vegbilde med id',
  body: {
    line1: 'Jeg vil melde fra om feil på følgende vegbilde:',
    line2: 'Beskrivelse: <Vennligst beskriv hva som er feil>',
  },
};

const onboardingText = {
  header: 'Velkommen til Vegbilder',
  paragraphs: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu
     neque eget eros interdum condimentum sed rutrum orci. Etiam cursus
     ac leo luctus tincidunt. Nunc consequat pellentesque magna ut
     fermentum. Etiam sit amet elementum tellus. Vestibulum ante ipsum
     primis in faucibus orci luctus et ultrices posuere cubilia curae;
     Curabitur facilisis sem quam, nec tempus justo tempus eu. Aenean
     congue urna sed lorem dictum tempor. Sed eget accumsan velit, in
     ultricies urna. Pellentesque eu risus non velit maximus rutrum.`,
    `Nulla viverra neque eget suscipit suscipit. Nam eget volutpat orci,
     eu posuere nisl. Nunc malesuada, elit vel sagittis molestie, mi mi
     rhoncus diam, quis volutpat turpis nibh sit amet quam. Nulla vitae
     est ac enim vehicula bibendum. Maecenas sed ornare lectus. Curabitur
     dapibus non orci id lacinia. Donec eu maximus eros. Maecenas
     elementum varius bibendum. Pellentesque non nisi vel nisl convallis
     volutpat. Nulla facilisi. Nullam ac eros et odio pulvinar posuere.
     Proin commodo libero ut nunc maximus, eget semper neque fringilla.
     Nam sit amet metus quam. Integer pretium ante et aliquet tincidunt.
     Vestibulum sit amet lectus a diam sodales consequat. Morbi gravida
     risus libero, sit amet tincidunt turpis ullamcorper et.`,
  ],
};

const informationText = {
  versionNumber: 'Versjonsnummer: 2.0.0',
  contact: 'Kontakt: vegbilder@vegvesen.no',
};

export { reportEmailTemplateText, onboardingText, informationText };
