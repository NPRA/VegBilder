import { getAvailableYears } from 'apis/VegbilderOGC/getAvailableYears';
/* Set the years for which image points should be made available. Should be listed
 * in reverse chronological order (ie. most recent first).
 * The application will attempt to fetch data from the OGC service based on the
 * selected year.
 *
 * WFS typename is expected to follow this pattern: vegbilder_1_0:Vegbilder_2020
 * WMS layer name (detailed) is expected to follow this pattern: Vegbilder_2020
 * WMS layer name (oversikt) is expected to follow this pattern: Vegbilder_oversikt_2020
 */
const availableYears = [2020, 2019];

/* The first year in the list of available years is selected by default (this
 * should be the most recent year). If you want another year - such as 2019 - to
 * be the default, then replace the following line with:
 * const defaultYear = 2019;
 */

const regexp = RegExp(/20\d{2}/, 'g');

const res = async () => {
  const ogcCapabilities = await getAvailableYears();
  console.log(ogcCapabilities.data);

  const matches = Array.from(ogcCapabilities.data.matchAll(regexp), (m) => m[0]);
  let unique = [...new Set(matches)];
  console.log(unique);
  return ogcCapabilities;
};

res();

const defaultYear = availableYears[0];

export { availableYears, defaultYear };
