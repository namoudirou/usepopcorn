import { useEffect, useRef } from "react";

function Search({ query, setQuery }) {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef?.current?.focus();
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputRef}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export default Search;
