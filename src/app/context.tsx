import React from "react";
import { IndexedDBConfig, getActions } from "./db";

export interface UseIndexedDBProps {
  config: IndexedDBConfig;
  children?;
  loading?;
  actions?: typeof getActions;
}

export const ObservationCreateContext = React.createContext<UseIndexedDBProps>(
  {} as UseIndexedDBProps
);
