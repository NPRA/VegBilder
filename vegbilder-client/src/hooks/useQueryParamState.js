import React from "react";

export default function useQueryParamState(
  name,
  defaultValue,
  validate,
  isInteger = false
) {
  const searchParams = new URLSearchParams(window.location.search);
  const [state, setStateInternal] = React.useState(
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
    return isInteger ? parseInt(searchParam, 10) : searchParam;
  }

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set(name, state);
    window.history.replaceState(null, "", "?" + newSearchParams.toString());
  }, [name, state]);

  function setState(newState) {
    if (isInteger && isNaN(newState)) {
      throw new Error("Tried to set invalid state. It should be an integer.");
    } else {
      setStateInternal(newState);
    }
  }

  return [state, setState];
}
