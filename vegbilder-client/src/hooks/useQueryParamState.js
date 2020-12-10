import React from "react";

export default function useQueryParamState(name, defaultValue, validate) {
  const searchParams = new URLSearchParams(window.location.search);
  const [state, setState] = React.useState(
    getValidatedSearchParam(name) || defaultValue
  );

  function getValidatedSearchParam(name) {
    const searchParam = searchParams.get(name);
    if (!searchParam) return null;
    if (validate(searchParam) === false) {
      throw new Error(
        `Invalid value of query parameter ${name}: ${searchParam}`
      );
    }
    return searchParam;
  }

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set(name, state);
    window.history.replaceState(null, "", "?" + newSearchParams.toString());
  }, [name, state]);

  return [state, setState];
}
