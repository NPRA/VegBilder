const settings = {
  targetBboxSize: 2000, // Will be used as the size of the bbox for fetching image points if the map bounds are not used (decided by shouldUseMapBoundsAsTargetBbox prop)
  nyesteTargetBboxSize: 500,
  debugMode: false,
};

const defaultCoordinates = {
  lat: '65',
  lng: '15',
};

export { settings, defaultCoordinates };