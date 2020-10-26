import axios from "axios";

export default axios.create({
  baseURL: "https://nvdbapiles-v3.atlas.vegvesen.no/",
});
