import nvdbApi from "./nvdbApi";

const getVegByVegsystemreferanse = async (vegsystemreferanse) => {
  const response = await nvdbApi.get("/veg", {
    params: {
      vegsystemreferanse: vegsystemreferanse,
    },
  });
};


export default getVegByVegsystemreferanse;
