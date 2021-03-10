// import React, { useEffect, useState } from 'react';
// import find from 'lodash/find';

// import useQueryParamState from '../hooks/useQueryParamState';
// import { useLoadedImagePoints } from './LoadedImagePointsContext';

// const CurrentImagePointContext = React.createContext();

// function useCurrentImagePoint() {
//   const context = React.useContext(CurrentImagePointContext);
//   if (!context) {
//     throw new Error('useCurrentImagePoint must be used within a CurrentImagePointProvider');
//   }
//   return context;
// }

// function CurrentImagePointProvider(props) {
//   const { loadedImagePoints } = useLoadedImagePoints();
//   const [currentImageId, setCurrentImageId] = useQueryParamState('imageId');
//   const [currentImagePoint, setCurrentImagePointInternal] = useState(null);

//   function setCurrentImagePoint(imagePoint) {
//     if (!imagePoint) {
//       console.error(
//         'Tried to set current image point to null or undefined. Use unsetCurrentImagePoint if you mean to do this.'
//       );
//       return;
//     }
//     setCurrentImagePointInternal(imagePoint);
//     setCurrentImageId(imagePoint.id);
//   }

//   function unsetCurrentImagePoint() {
//     setCurrentImagePointInternal(null);
//     setCurrentImageId('');
//   }

//   /* Initialize current image point based on currentImageId (from query param) once loadedImagePoints
//    * has been populated. We have to find the actual image point with that id among the loaded image
//    * points.
//    */
//   useEffect(() => {
//     if (loadedImagePoints?.imagePoints && currentImagePoint == null && currentImageId !== '') {
//       const imagePoint = find(loadedImagePoints.imagePoints, (ip) => ip.id === currentImageId);
//       if (imagePoint) {
//         setCurrentImagePointInternal(imagePoint);
//         setCurrentImageId(imagePoint.id);
//       }
//     }
//   }, [currentImageId, currentImagePoint, loadedImagePoints, setCurrentImageId]);

//   return (
//     <CurrentImagePointContext.Provider
//       value={{
//         currentImagePoint,
//         setCurrentImagePoint,
//         unsetCurrentImagePoint,
//       }}
//       {...props}
//     />
//   );
// }

// export { CurrentImagePointProvider, useCurrentImagePoint };
