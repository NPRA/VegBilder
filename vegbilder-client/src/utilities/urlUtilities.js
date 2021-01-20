const getShareableUrlForImage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return `${window.location.protocol}//${window.location.host}?${searchParams.toString()}`;
};

export { getShareableUrlForImage };
