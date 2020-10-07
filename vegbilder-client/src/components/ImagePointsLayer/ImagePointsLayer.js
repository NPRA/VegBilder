import React, { useEffect, useState } from "react";
import { Icon } from "leaflet";
import { useLeafletBounds } from "use-leaflet";
import { Rectangle, Marker } from "react-leaflet";

import getImagePointsInVisibleMapArea from "../../apis/VegbilderOGC/getImagePointsInVisibleMapArea";

const settings = {
  useSmallerMapAreaBbox: false,
  drawBboxes: false,
};

const ImagePointsLayer = () => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const [imagePoints, setImagePoints] = useState([]);
  const [fetchedBboxes, setFetchedBboxes] = useState([]);

  useEffect(() => {
    (async () => {
      const bbox = createBboxForVisibleMapArea();
      const {
        imagePoints,
        fetchedBboxes,
      } = await getImagePointsInVisibleMapArea(bbox);
      setImagePoints(imagePoints);
      setFetchedBboxes(fetchedBboxes);
    })();
  }, [south, west, north, east]);

  const createBboxForVisibleMapArea = () => {
    if (settings.useSmallerMapAreaBbox) {
      const dY = north - south;
      const dX = east - west;
      return {
        south: south + dY / 4,
        west: west + dX / 4,
        north: north - dY / 4,
        east: east - dX / 4,
      };
    } else {
      return {
        south,
        west,
        north,
        east,
      };
    }
  };

  const renderBbox = (bbox) => {
    return (
      <Rectangle
        bounds={[
          [bbox.south, bbox.west],
          [bbox.north, bbox.east],
        ]}
      />
    );
  };

  const renderMapAreaBbox = () => {
    const bbox = createBboxForVisibleMapArea(south, west, north, east);
    return renderBbox(bbox);
  };

  const renderFetchBboxes = () => {
    if (fetchedBboxes) {
      return <>{fetchedBboxes.map((bbox) => renderBbox(bbox))}</>;
    }
  };

  const getNonDirectionalMarkerIcon = () => {
    return new Icon({
      iconUrl: "images/marker.png",
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
  };

  const renderImagePoints = () => {
    if (imagePoints) {
      return (
        <>
          {imagePoints.map((imagePoint) => (
            <Marker
              key={imagePoint.id}
              position={[
                imagePoint.geometry.coordinates[1],
                imagePoint.geometry.coordinates[0],
              ]}
              icon={getNonDirectionalMarkerIcon()}
            />
          ))}
        </>
      );
    }
  };

  return (
    <>
      {settings.drawBboxes && renderMapAreaBbox()}
      {settings.drawBboxes && renderFetchBboxes()}
      {renderImagePoints()}
    </>
  );
};

export default ImagePointsLayer;
