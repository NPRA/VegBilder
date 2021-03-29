import axios from 'axios';

export default axios.create({
  baseURL: 'https://vegkart.atlas.vegvesen.no/api/baatticket?ip=81.88.73.2',
});
