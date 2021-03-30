import axios from 'axios';
import { S3_HEALTH } from 'constants/urls';

export default axios.create({
  baseURL: S3_HEALTH,
});
