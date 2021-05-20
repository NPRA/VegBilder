import axios from 'axios';
import { WSGEONORGE } from 'constants/urls';

export default axios.create({
  baseURL: WSGEONORGE,
});
