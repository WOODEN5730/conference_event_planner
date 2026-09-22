import React, { useState } from "react";
import "./ConferenceEvent.css";

import TotalCost from "./TotalCost";

import { useSelector, useDispatch } from "react-redux";
import { toggleMealSelection } from "./mealsSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";

export default function ConferenceEvent() {
  const dispatch = useDispatch();

  // Redux state
  const meals = useSelector((state) => state.meals.items);
  const avItems = useSelector((state) => state.av.items);

  // Local UI state
  const [attendees, setAttendees] = useState(1);

  const handleMealToggle = (mealId) => {
    dispatch(toggleMealSelection(mealId));
  };

  const handleAvIncrement = (itemId) => {
    dispatch(incrementAvQuantity(itemId));
  };

  const handleAvDecrement = (itemId) => {
    dispatch(decrementAvQuantity(itemId));
  };

  return (
    <div className="conference-event">
      <h1>Conference Event Planner</h1>

      {/* Attendees */}
      <section className="attendee-section">
        <label>Number of Attendees</label>
        <input
          type="number"
          min="1"
          value={attendees}
          onChange={(e) => setAttendees(Number(e.target.value))}
        />
      </section>

      {/* Meals */}
      <section className="meals-section">
        <h2>Meal Selection</h2>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-item">
            <label>
              <input
                type="checkbox"
                checked={meal.selected}
                onChange={() => handleMealToggle(meal.id)}
              />
              {meal.name} — ${meal.price}
            </label>
          </div>
        ))}
      </section>

      {/* AV Equipment */}
      <section className="av-section">
        <h2>AV Equipment</h2>
        {avItems.map((item) => (
          <div key={item.id} className="av-item">
            <span>{item.name} — ${item.price}</span>

            <div className="av-controls">
              <button onClick={() => handleAvDecrement(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleAvIncrement(item.id)}>+</button>
            </div>
          </div>
        ))}
      </section>

      {/* Total Cost */}
      <TotalCost attendees={attendees} />
    </div>
  );
}
