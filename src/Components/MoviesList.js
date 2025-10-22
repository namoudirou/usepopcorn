import Movie from "./Movie";

function MoviesList({ movies, onHandleClickMovie }) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie
          onHandleClickMovie={onHandleClickMovie}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

export default MoviesList;
