import React from "react";

export default function useQueryParamState(name, defaultValue) {
  const searchParams = new URLSearchParams(window.location.search);
  const [state, setState] = React.useState(
    searchParams.get(name) || defaultValue
  );

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set(name, state);
    window.history.replaceState(null, "", "?" + newSearchParams.toString());
  }, [name, state]);

  return [state, setState];
}
