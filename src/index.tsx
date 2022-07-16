import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./bootstrap.scss";
import "./index.scss";
import HomePage from "./pages/Home";
import FavoritesPage from "./pages/Favorites";
import NotFoundPage from "./pages/NotFound";
import DetailPage from "./pages/Detail";
import { IndexedDBProvider } from "./app/providers";
import localDbConfig from "./config/db/local";

const container = document.getElementById("root")!;
const root = createRoot(container);

const RoutedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="i/:imdbId" element={<DetailPage />} />
          <Route path="favorites" element={<FavoritesPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

root.render(
  <React.StrictMode>
    <IndexedDBProvider config={localDbConfig}>
      <Provider store={store}>
        <RoutedApp />
      </Provider>
    </IndexedDBProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
