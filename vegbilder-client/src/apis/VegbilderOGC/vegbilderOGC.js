import axios from 'axios';
import { config } from 'constants/urls';

export default axios.create({
  baseURL: config,
});
