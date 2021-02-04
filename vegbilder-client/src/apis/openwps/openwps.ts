import axios from 'axios';

export default axios.create({
  baseURL: 'http://openwps.statkart.no/',
});
