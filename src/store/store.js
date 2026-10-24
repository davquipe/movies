import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./slice/homeSlice";
import watchlistSlice from "./slice/watchlistSlice";

export const store = configureStore({
    reducer: {
        home: homeSlice,
        watchlist: watchlistSlice,
    }
})
