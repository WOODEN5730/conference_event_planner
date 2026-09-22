import { configureStore } from "@reduxjs/toolkit";
import mealsReducer from "./mealsSlice";
import avReducer from "./avSlice";

const store = configureStore({
  reducer: {
    meals: mealsReducer,
    av: avReducer,
  },
});

export default store;
