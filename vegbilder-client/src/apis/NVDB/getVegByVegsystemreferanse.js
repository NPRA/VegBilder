import nvdbApi from "./nvdbApi";

const getVegByVegsystemreferanse = async (vegsystemreferanse) => {
  const response = await nvdbApi.get("/veg", {
    params: {
      vegsystemreferanse: vegsystemreferanse,
      srid: "4326",
    },
  });
  return response;
};


export default getVegByVegsystemreferanse;
