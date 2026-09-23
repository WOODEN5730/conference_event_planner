import { configureStore } from "@reduxjs/toolkit";
import venueReducer from "./venueSlice";

const store = configureStore({
  reducer: {
    venue: venueReducer
  }
});

export default store;
