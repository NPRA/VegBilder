import axios from 'axios';

export default axios.create({
  baseURL: 'https://ws.geonorge.no/',
});
