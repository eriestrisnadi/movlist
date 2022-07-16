const BASE_URL: string = "http://www.omdbapi.com/";
const API_KEY = process.env.REACT_APP_OMDB_API_KEY || "";

export interface IMovieRating {
  Source: string;
  Value: string;
}

export interface IMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Ratings?: IMovieRating[];
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response?: string;
}

export async function searchMovie(term: string) {
  return await fetch(
    `${BASE_URL}?${new URLSearchParams({
      apikey: API_KEY,
      s: term,
    })}`
  )
    .then(async (response) => await response.json())
    .then(({ Search }) => ({ data: (Search || []) as IMovie[] }));
}

export async function detailMovie(imdbID: string) {
  return await fetch(
    `${BASE_URL}?${new URLSearchParams({
      apikey: API_KEY,
      i: imdbID,
    })}`
  )
    .then(async (response) => await response.json())
    .then((data: IMovie) => ({ data }));
}
