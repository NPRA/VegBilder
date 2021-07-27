import axios from 'axios';
import { OGC_URL } from 'constants/urls';

export default axios.create({
  baseURL: OGC_URL,
});
