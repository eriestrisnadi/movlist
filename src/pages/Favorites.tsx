import React from "react";
import { Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchFavoriteList,
  selectFavorite,
} from "../features/movie/movieSlice";
import { useOnceEffect } from "../utils";

function FavoritesPage() {
  const { metadata, list } = useAppSelector(selectFavorite);
  const dispatch = useAppDispatch();

  useOnceEffect(() => dispatch(fetchFavoriteList()));

  if (metadata.status === "loading")
    return (
      <>
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </>
    );

  return (
    <>
      {metadata.status === "idle" && list.length > 0 ? (
        <Table responsive className="text-start mt-4">
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>imDB ID</th>
            </tr>
          </thead>
          <tbody>
            {list.map(({ Title, Year, imdbID }, movieIndex) => (
              <tr key={`movie-col-${movieIndex}-${imdbID}`}>
                <td>
                  <Link to={`/i/${imdbID}`}>{Title}</Link>
                </td>
                <td>{Year}</td>
                <td>{imdbID}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
    </>
  );
}

export default FavoritesPage;
