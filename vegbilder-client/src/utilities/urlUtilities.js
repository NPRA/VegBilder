import { getImagePointLatLng } from "./imagePointUtilities";

function getShareableUrlForImage(currentImagePoint) {
  const imagePointCoordinates = getImagePointLatLng(currentImagePoint);
  const zoom = 16;
  const searchParams = new URLSearchParams(window.location.search);

  /* Force coordinates of shared URL to be the coordinates of the image point.
   * Otherwise the link may not work if the user panned far away from the selected
   * image point or zoomed out before clicking the share button. (The url only
   * specifies the id of the selected image point. The image point will then be
   * selected if it is among the loadedImagePoints. We ensure this by forcing the
   * coordinates in this manner.)
   */
  const coordinateString = `${imagePointCoordinates.lat},${imagePointCoordinates.lng},${zoom}`;
  searchParams.set("coordinates", coordinateString);
  return `${window.location.protocol}//${
    window.location.host
  }?${searchParams.toString()}`;
}

export { getShareableUrlForImage };
