import axios from 'axios';
import { NVDBAPI } from 'constants/urls';

export default axios.create({
  baseURL: NVDBAPI,
});
