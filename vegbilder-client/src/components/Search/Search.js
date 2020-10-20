import React from "react";
import { Form } from "semantic-ui-react";

import getVegByVegsystemreferanse from "../../apis/NVDB/getVegByVegsystemreferanse";
import getNearestImagePoint from "../../apis/VegbilderOGC/getNearestImagePoint";

const Search = ({ setCurrentLocation, setCurrentImagePoint }) => {
  const onKeyDown = async (event) => {
    if (event.key === "Enter") {
      const vegsystemreferanse = event.target.value;
      console.log(`Searching for ${vegsystemreferanse}`);
      const latlng = await getCoordinates(vegsystemreferanse);
      console.log(latlng);
      if (latlng) {
        selectImagePointNearLocation(latlng);
        setCurrentLocation(latlng);
      }
    }
  };

  const selectImagePointNearLocation = async (latlng) => {
    const nearestImagePoint = await getNearestImagePoint(latlng);
    setCurrentImagePoint(nearestImagePoint);
  };

  return (
    <Form>
      <Form.Field>
        <input
          placeholder="Søk etter vegsystemreferanse"
          onKeyDown={onKeyDown}
        />
      </Form.Field>
    </Form>
  );
};

const getCoordinates = async (vegsystemreferanse) => {
  const vegResponse = await getVegByVegsystemreferanse(vegsystemreferanse);
  if (vegResponse) {
    const wkt = vegResponse.data?.geometri?.wkt;
    return getCoordinatesFromWkt(wkt);
  }
};

const getCoordinatesFromWkt = (wkt) => {
  const split = wkt?.split(/[()]/);
  const coordinateString = split[1];
  if (!coordinateString) return null;
  const coordinates = coordinateString.split(" ");
  return {
    lat: parseFloat(coordinates[0]),
    lng: parseFloat(coordinates[1]),
  };
};

export default Search;
