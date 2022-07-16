import React from "react";
import { ObservationCreateContext, UseIndexedDBProps } from "./context";
import { getConnection, getActions } from "./db";

/**
 * React Context Provider for IndexedDB
 */
export const IndexedDBProvider = (props: UseIndexedDBProps) => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    getConnection(props.config).then(() => setIsInitialized(true));
  }, [props]);

  return isInitialized ? (
    <ObservationCreateContext.Provider
      value={{ config: props.config, actions: getActions }}
    >
      {props.children}
    </ObservationCreateContext.Provider>
  ) : (
    props.loading || null
  );
};
