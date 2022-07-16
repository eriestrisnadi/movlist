import React from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ObservationCreateContext } from "./context";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useIndexedDBStore<T>(storeName: string) {
  const ctx = React.useContext(ObservationCreateContext);

  return ctx.actions!<T>(storeName, ctx.config);
}
