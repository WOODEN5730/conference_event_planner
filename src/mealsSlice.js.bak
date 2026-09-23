import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    { id: 1, name: "Breakfast", price: 15, selected: false },
    { id: 2, name: "Lunch", price: 20, selected: false },
    { id: 3, name: "Dinner", price: 25, selected: false },
  ],
};

const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    toggleMealSelection: (state, action) => {
      const meal = state.items.find((m) => m.id === action.payload);
      if (meal) meal.selected = !meal.selected;
    },
  },
});

export const { toggleMealSelection } = mealsSlice.actions;
export default mealsSlice.reducer;
