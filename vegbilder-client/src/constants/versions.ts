const versionLog = {
  'v1.3.16': [
    'Oppdatert til Geonorges nye api for stedsnavn',
    'Mulig å legge til parameteren "radius" i url for å begrense søk etter bilder til innenfor en radius (i meter) fra et koordinat'
  ],
  'v1.3.8': [
    'Kan sende med vegsystemreferanse i url',
    'La til statistikk som gir en oversikt over hvor mange bilder som er tilgjengelige.'
  ],
  'v1.3.5': ['Pakkeoppdateringer, inkludert en stor endring i kartet og diverse kodeforbedringer'],
  'v1.3.2': [
    'Uthev fokuserte elementer litt i menyene',
    'Pass på at basislinjen alltid holder seg på veien når bildet/skjermen skaleres',
    'Legg til en sjekk på hovedparsell når brukeren bytter retning for game vegreferanser. Dette gjør at den ikke alltid bytter på flerfeltsveiene, men til gjengjeld alltid bytter til andre veien',
  ],
  'v1.3.1': [
    '🐞 Bugfiks: La til en forsinkelse på oppdatering av url i filmmodus. Tidligere krasjet noen nettlesere fordi urlen ble oppdatert for ofte her',
    'Fjernet React-favicon',
    'La til pre-lasting av neste bildepunkt',
    'Gi brukeren en forståelig feilmelding når appen crasher',
  ],
  'v1.3.0': [
    'Oppdatere til samme bildemarkører for eldre årganger og nyeste',
    'Endre ruten i produksjon til å være ekstern',
  ],
  'v1.2.26': ['🐞 Bugfiks: oppdater bildepunktene når man drar i kartet'],
  'v1.2.25': ['Zoom in hvor brukeren klikket', 'Forbedringer på scroll'],
  'v1.2.24': [
    'Kan gå fremover/bakover i historiske bilder',
    'Deaktivert zoom-knappen i historisk visning',
    'Endret teksten på headeren til historiske bilder til "Fra samme lokasjon og kjøreretning"',
    'Endret valg for hastighet i filmmodus (fjernet 1 sekunds hastighet)',
    'Hent fylkesnummer fra API i stedet for metadata (dagsaktuelt)',
  ],
  'v1.2.23': ['🐞 Bugfiks på historiske bilder'],
  'v1.2.22': ['Bedre tilpassning av mobilsiden'],
  'v1.2.21': [
    '🐞 Bugfiks: kan klikke på markører i nærheten av og under bildet ',
    'Landingsside for mobil',
  ],
  'v1.2.20': ['Rettet opp skrivefeil', 'Bedre skalering av skjema'],
  'v1.2.19': [
    'Åpne lenker til NVDB og Geonorge i ny fane',
    'Fikse bug som oppstår når brukeren zoomer inn, går frem og zoomer ut',
    'Søkefelt like stort som forslag under',
    'Tynn ramme på søkemeny og sideinformasjon',
  ],
  'v1.2.18': [
    'Sentrere tilbakemelding og feilmeldingsskjema',
    'Disable knapp for tilbake til hovedkart når brukeren er i zoom-modus',
    'Legge lukkeknappen på linje med knappene på venstre side',
    'Større skriftstørrelse på overskifter i bildeinfo',
    'Lik padding på alle tabs',
    'Aktiv tab "Om" fra start',
  ],
  'v1.2.17': [
    'Max bredde på sideinformasjonen',
    'Klikke på skjul/vis minikart',
    'Ta vekk innstillingsknappen',
    'Fikse buggy vis/skjul oppstartsmelding',
    'Lenker til Geonorge og NVDB',
  ],
  'v1.2.16': [
    'Velkomstmelding og sideinformasjon er nå samme komponent',
    'Teksten og tabs er oppdatert',
    'Zoom inn brukeren noen hakk dersom appen ikke finner bilder der den klikker (gjelder kun zoom-nivåer mindre enn 8)',
    'Rundede kanter på scrollbar i bildeinfo',
    'Fikse hoppende knapper i Chrome/Edge',
    'Link til vegkart oransje med ikonet når du hovrer',
    'Zoom nivå til vegkart 14',
    'Brukeren kan klikke på "skjema" for å åpne feilmeldingsskjema/tilbakemeldingsskjema. Den har også blitt stylet',
    'Tilbake til stort kart ved å klikke på minikartet',
    'Gjør oppslag på vegsystemreferanse til NVDB uansett år',
  ],
  'v1.2.15': [
    'Flyttet minibildet til øvre venstre hjørnet, endret styling og la til informasjonsknapp',
    'Tok tilbake knapp/ikon for bildemodus fra hovedkartet',
    'Endret zoom-nivå på lenke til vegkart til 13 ',
    'Fylke under kommune og ny header i informasjonsboksen',
    'Stylet alle scrollbarer',
    'Bedre skalering av informasjonsboks og minikart',
    'Lik border radius og skygge på lignende elementer',
    'Nytt instillingsikon',
    'Gjenommsiktighet på bakgrunner og ikke tekst/andre ting',
    'Ikoner i fargeforklareren og ikke sirkler',
    'Versjonslogg (redesign av velkomstvindu/info)',
    'Filtrere på vegkategori ved spørring om vegsystemreferanse fra NVDB (2019 og eldre)',
  ],
};

export { versionLog };
