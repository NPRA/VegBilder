import axios from 'axios';

export default axios.create({
  baseURL: 'https://www.utv.vegvesen.no/kart/ogc/vegbilder_1_0/ows',
});
