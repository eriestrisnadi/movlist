import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { generateReducerMap, withGuid, WithGuid } from "../../utils";
import { detailMovie, IMovie, searchMovie } from "./movieApi";
import { getActions } from "../../app/db";

export type MovieFeatures = "search" | "favorite";

interface MetaData {
  term: string;
  status: "loading" | "idle" | "failed";
}

export type MovieModel = WithGuid<IMovie>;

export interface MovieState {
  current: MovieModel | null;
  list: Record<MovieFeatures, MovieModel[]>;
  metadata: Record<MovieFeatures | "current", MetaData>;
}

const initialState: MovieState = {
  current: null,
  list: {
    search: [],
    favorite: [],
  },
  metadata: {
    search: {
      term: "",
      status: "idle",
    },
    favorite: {
      term: "",
      status: "idle",
    },
    current: {
      term: "",
      status: "idle",
    },
  },
};

/**
 * AsyncThunk to fetch data from api to get movie detail using imdbId
 */
export const fetchDetail = createAsyncThunk(
  "movie/fetchDetail",
  async (imdbId: string): Promise<MovieModel> => {
    const response = await detailMovie(imdbId);
    const data = withGuid(response.data);

    return data;
  }
);

/**
 * AsyncThunk to fetch data from api to get related movie to the term
 */
export const fetchSearchList = createAsyncThunk(
  "movie/fetchSearchList",
  async (
    term: string
  ): Promise<{ list: MovieModel[]; metadata?: Partial<MetaData> }> => {
    const response = await searchMovie(term);

    return {
      list: response.data.map(withGuid),
      metadata: {
        term,
      },
    };
  }
);

/**
 * AsyncThunk to fetch data from indexeddb to get favorites movie
 */
export const fetchFavoriteList = createAsyncThunk(
  "movie/fetchFavoriteList",
  async (): Promise<{ list: MovieModel[]; metadata?: Partial<MetaData> }> => {
    const { getAll } = getActions<MovieModel>("favorite_movies");
    const data = await getAll();

    return {
      list: data as unknown as MovieModel[],
    };
  }
);

/**
 * AsyncThunk to fetch data from indexeddb to add favorite movie
 */
export const addToFavorite = createAsyncThunk(
  "movie/addToFavorite",
  async (movie: MovieModel) => {
    const { update, getOneByIndex } = getActions<MovieModel>("favorite_movies");
    const stored = await getOneByIndex("imdb_id", movie.imdbID);

    if (typeof stored !== "undefined") {
      const { guid } = stored;

      return await update({ ...stored, ...movie, guid });
    }

    return await update(movie);
  }
);

/**
 * Movie slice for redux store
 */
export const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const reducerMap = [
      generateReducerMap<MovieFeatures, typeof fetchSearchList>(
        "search",
        fetchSearchList
      ),
      generateReducerMap<MovieFeatures, typeof fetchFavoriteList>(
        "favorite",
        fetchFavoriteList
      ),
    ];

    // Loop through reducerMap to create asyncThunk feature
    for (const { target, thunk } of reducerMap) {
      builder
        .addCase(thunk.pending, (state) => {
          state.metadata[target].status = "loading";
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.metadata[target].status = "idle";
          state.list[target] = action.payload.list;

          // merge metadata from payload and original
          state.metadata[target] = {
            ...state.metadata[target],
            ...(action.payload.metadata || {}),
          };
        })
        .addCase(thunk.rejected, (state) => {
          state.metadata[target].status = "failed";
        });
    }

    // add asyncThunk for current feature
    builder
      .addCase(fetchDetail.pending, (state) => {
        state.metadata.current.status = "loading";
      })
      .addCase(fetchDetail.fulfilled, (state, action) => {
        state.metadata.current.status = "idle";
        state.current = action.payload;
      })
      .addCase(fetchDetail.rejected, (state) => {
        state.metadata.current.status = "failed";
      });

    // add asyncThunk for addToFavorite
    builder
      .addCase(addToFavorite.pending, (state) => {
        state.metadata.favorite.status = "loading";
      })
      .addCase(addToFavorite.fulfilled, (state) => {
        state.metadata.favorite.status = "idle";
      })
      .addCase(addToFavorite.rejected, (state, action) => {
        state.metadata.favorite.status = "failed";
      });
  },
});

/**
 * Exclude from ReturnType generateSelect those types that are assignable to T
 */
type ExcludeSelector<
  T extends keyof Required<ReturnType<typeof generateSelect>>
> = Required<Omit<ReturnType<typeof generateSelect>, T>>;

/**
 * Generate feature selector for movie/module state
 */
const generateSelect = (
  feature: MovieFeatures | "current",
  state: MovieState
): {
  list?: typeof state.list[MovieFeatures];
  current?: typeof state.current;
  metadata: typeof state.metadata[MovieFeatures];
} => ({
  ...(feature === "current"
    ? { current: state.current }
    : { list: state.list[feature] }),
  metadata: state.metadata[feature],
});

/**
 * Get Search feature selector from movie/module state
 */
export const selectSearch = (state: RootState) =>
  generateSelect("search", state.movie) as ExcludeSelector<"current">;

/**
 * Get Favorite feature selector from movie/module state
 */
export const selectFavorite = (state: RootState) =>
  generateSelect("favorite", state.movie) as ExcludeSelector<"current">;

/**
 * Get Current feature selector from movie/module state
 */
export const selectCurrent = (state: RootState) =>
  generateSelect("current", state.movie) as ExcludeSelector<"list">;

export default movieSlice.reducer;
