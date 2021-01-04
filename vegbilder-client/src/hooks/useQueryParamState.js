import { useEffect, useState } from 'react';

const useQueryParamState = (name, defaultValue, validate, isInteger = false) => {
  const getValidatedSearchParam = (name) => {
    const searchParam = searchParams.get(name);
    if (!searchParam) return null;
    if (validate(searchParam) === false) {
      throw new Error(`Invalid value of query parameter ${name}: ${searchParam}`);
    }
    return isInteger ? parseInt(searchParam, 10) : searchParam;
  };

  const searchParams = new URLSearchParams(window.location.search);
  const [state, setStateInternal] = useState(getValidatedSearchParam(name) || defaultValue);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set(name, state);
    window.history.replaceState(null, '', '?' + newSearchParams.toString());
  }, [name, state]);

  const setState = (newState) => {
    if (isInteger && isNaN(newState)) {
      throw new Error('Tried to set invalid state. It should be an integer.');
    } else {
      setStateInternal(newState);
    }
  };

  return [state, setState];
};

export default useQueryParamState;
