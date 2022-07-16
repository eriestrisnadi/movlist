import React from "react";
import { Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useDebounce, useOnceEffect } from "../../utils";
import {
  addToFavorite,
  fetchFavoriteList,
  fetchSearchList,
  MovieModel,
  selectFavorite,
  selectSearch,
} from "./movieSlice";

function SearchMovie() {
  const search = useAppSelector(selectSearch);
  const favorite = useAppSelector(selectFavorite);
  const favoriteImbdIds = favorite.list.map(({ imdbID }) => imdbID);
  const [term, setTerm] = React.useState(search.metadata.term);
  const dispatch = useAppDispatch();
  const fetchData = useDebounce((term: string) => {
    dispatch(fetchSearchList(term));
  });

  const handleSearch = (term: string) => {
    setTerm(term);
    fetchData(term);
  };

  const handleAddToFavorite = async (movie: MovieModel) => {
    await dispatch(addToFavorite(movie));
    dispatch(fetchFavoriteList());
  };

  const favoriteColor = (
    imdbID: string,
    callbackColor: string = "currentColor"
  ) => (favoriteImbdIds.includes(imdbID) ? "yellow" : callbackColor);

  useOnceEffect(() => dispatch(fetchFavoriteList()));

  return (
    <div>
      <input
        autoFocus
        type="text"
        className="form-control"
        placeholder="Search"
        onInput={(e) => handleSearch(e.currentTarget.value)}
        value={term as string}
      />

      {search.metadata.status === "loading" ? (
        <>
          <div className="text-center mt-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </>
      ) : null}

      {search.metadata.status === "idle" && search.list.length > 0 ? (
        <Table responsive className="text-start mt-5">
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>imDB ID</th>
            </tr>
          </thead>
          <tbody>
            {search.list.map((movie, movieIndex) => (
              <tr key={`movie-col-${movieIndex}-${movie.guid}`}>
                <td>
                  <Link to={`/i/${movie.imdbID}`}>{movie.Title}</Link>
                </td>
                <td>{movie.Year}</td>
                <td>{movie.imdbID}</td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill={favoriteColor(movie.imdbID, "none")}
                    viewBox="0 0 24 24"
                    stroke={favoriteColor(movie.imdbID)}
                    strokeWidth="2"
                    type="button"
                    onClick={() => handleAddToFavorite(movie)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
    </div>
  );
}

export default SearchMovie;
