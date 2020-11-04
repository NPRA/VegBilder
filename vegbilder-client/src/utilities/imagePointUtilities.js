function getImagePointLatLng(imagePoint) {
  const lat = imagePoint.geometry.coordinates[1];
  const lng = imagePoint.geometry.coordinates[0];
  return { lat, lng };
}

export { getImagePointLatLng };
