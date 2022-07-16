import { IndexedDBColumn, IndexedDBConfig } from "../../app/db";
import type { IMovie } from "../../features/movie/movieApi";

type MovieIndices = {
  keyPath: keyof IMovie;
} & IndexedDBColumn;

const localDbConfig: IndexedDBConfig = {
  databaseName: "rottenApple-db",
  version: 1,
  stores: [
    {
      name: "favorite_movies",
      id: { keyPath: "guid", autoIncrement: false },
      indices: [
        { keyPath: "Title", name: "title", options: { unique: false } },
        { keyPath: "Year", name: "year" },
        { keyPath: "imdbID", name: "imdb_id" },
        { keyPath: "Type", name: "type" },
        { keyPath: "Poster", name: "poster" },
        { keyPath: "Rated", name: "rated" },
        { keyPath: "Released", name: "released" },
        { keyPath: "Runtime", name: "runtime" },
        { keyPath: "Genre", name: "genre" },
        { keyPath: "Director", name: "director" },
        { keyPath: "Writer", name: "writer" },
        { keyPath: "Actors", name: "actors" },
        { keyPath: "Plot", name: "plot" },
        { keyPath: "Language", name: "language" },
        { keyPath: "Country", name: "country" },
        { keyPath: "Awards", name: "awards" },
        { keyPath: "Ratings", name: "ratings" },
        { keyPath: "Metascore", name: "meta_score" },
        { keyPath: "imdbRating", name: "imdb_ratings" },
        { keyPath: "imdbVotes", name: "imdb_votes" },
        { keyPath: "DVD", name: "dvd" },
        { keyPath: "BoxOffice", name: "box_office" },
        { keyPath: "Production", name: "production" },
        { keyPath: "Website", name: "website" },
        { keyPath: "Response", name: "response" },
      ] as MovieIndices[],
    },
  ],
};

export default localDbConfig;
