import React from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchDetail, selectCurrent } from "../features/movie/movieSlice";
import { useOnceEffect } from "../utils";
import "./Detail.scss";

function DetailPage() {
  const dispatch = useAppDispatch();
  const { current, metadata } = useAppSelector(selectCurrent);
  const { imdbId } = useParams();

  useOnceEffect(() => {
    if (typeof imdbId !== "string") return;

    dispatch(fetchDetail(imdbId));
  });

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
    <div>
      <img
        src={current?.Poster}
        alt={`${current?.Title}'s cover`}
        className="ImagePoster"
      />
      <h2>{current?.Title}</h2>
      <p>Year : {current?.Year}</p>
      <p>Released : {current?.Released}</p>
      <p>Director : {current?.Director}</p>
      <p>Actors : {current?.Actors}</p>
      <p>Plot : {current?.Plot}</p>
      <p>Awards : {current?.Awards}</p>
    </div>
  );
}

export default DetailPage;
