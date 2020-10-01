import React from "react";
import { Form } from "semantic-ui-react";

import getVegByVegsystemreferanse from "../../apis/NVDB/getVegByVegsystemreferanse";

const Search = () => {
  const onKeyDown = async (event) => {
    if (event.key === "Enter") {
      console.log(`Searching for ${event.target.value}`);
      const response = await performSearch(event.target.value);
      console.log(response);
    }
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

const performSearch = async (query) => {
  const vegResponse = await getVegByVegsystemreferanse(query);
  return vegResponse;
};

export default Search;
