const degreesToRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

const isEvenNumber = (integer) => {
  return integer % 2 === 0;
};

export { degreesToRadians, isEvenNumber };
