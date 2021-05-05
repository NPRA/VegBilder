import { MEDIA_QUERIES } from 'theme/Theme';
import { useMediaQuery } from 'react-responsive';

export const useIsMobile = () => {
  return useMediaQuery({ query: MEDIA_QUERIES.mobile.replace('@media ', '') });
};
