const degreesToRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

const isEvenNumber = (integer) => {
  return integer % 2 === 0;
};

const roundDownToNearest = (number, interval) => {
  const multiplier = 1 / interval;
  const rounded = Math.floor(number * multiplier) / multiplier;
  return rounded;
};

const roundUpToNearest = (number, interval) => {
  const multiplier = 1 / interval;
  const rounded = Math.ceil(number * multiplier) / multiplier;
  return rounded;
};

export { degreesToRadians, isEvenNumber, roundDownToNearest, roundUpToNearest };
