import React, { useState } from "react";
import "./ConferenceEvent.css";

import TotalCost from "./TotalCost";

import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";

const ConferenceEvent = () => {
  const [showItems, setShowItems] = useState(false);

  // Your slice is an array, so this is correct
  const venueItems = useSelector((state) => state.venue);

  const dispatch = useDispatch();

  // Fix auditorium name (remove leading space in slice!)
  const auditorium = venueItems.find(
    (item) => item.name === "Auditorium Hall (Capacity:200)"
  );

  const remainingAuditoriumQuantity = auditorium
    ? 3 - auditorium.quantity
    : 3;

  const handleToggleItems = () => {
    setShowItems((prev) => !prev);
  };

  const handleAddToCart = (index) => {
    const item = venueItems[index];

    if (
      item.name === "Auditorium Hall (Capacity:200)" &&
      item.quantity >= 3
    ) {
      return;
    }

    dispatch(incrementQuantity(index));
  };

  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  // Venue cost
  const venueTotalCost = venueItems.reduce(
    (total, item) => total + item.cost * item.quantity,
    0
  );

  // ⭐ Meals state
  const [meals, setMeals] = useState([
    { id: 1, name: "Breakfast Buffet", price: 15, selected: false },
    { id: 2, name: "Lunch Buffet", price: 25, selected: false },
    { id: 3, name: "Dinner Buffet", price: 35, selected: false },
  ]);

  const handleMealToggle = (id) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, selected: !meal.selected } : meal
      )
    );
  };

  // ⭐ Correct meal cost calculation
  const mealTotalCost = meals
    .filter((meal) => meal.selected)
    .reduce((total, meal) => total + meal.price, 0);

  // ⭐ Combined total cost
  const combinedTotalCost = venueTotalCost + mealTotalCost;

  const navigateToProducts = (idType) => {
    if (["#venue", "#addons", "#meals"].includes(idType)) {
      if (!showItems) {
        setShowItems(true);
      }
    }
  };

  return (
    <>
      <nav className="navbar_event_conference">
        <div className="company_logo">Conference Expense Planner</div>

        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={() => navigateToProducts("#venue")}>
              Venue
            </a>
            <a href="#addons" onClick={() => navigateToProducts("#addons")}>
              Add-ons
            </a>
            <a href="#meals" onClick={() => navigateToProducts("#meals")}>
              Meals
            </a>
          </div>

          <button className="details_button" onClick={handleToggleItems}>
            Show Details
          </button>
        </div>
      </nav>

      <div className="main_container">
        {!showItems ? (
          <div className="items-information">
            {/* Venue Section */}
            <div id="venue" className="venue_container container_main">
              <div className="text">
                <h1>Venue Room Selection</h1>
              </div>

              <div className="venue_selection">
                {venueItems.map((item, index) => (
                  <div className="venue_main" key={index}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>

                    <div className="text">{item.name}</div>
                    <div>${item.cost}</div>

                    <div className="button_container">
                      {item.name === "Auditorium Hall (Capacity:200)" ? (
                        <>
                          <button
                            className={
                              item.quantity === 0
                                ? "btn-warning btn-disabled"
                                : "btn-minus btn-warning"
                            }
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &#8211;
                          </button>

                          <span className="selected_count">
                            {item.quantity}
                          </span>

                          <button
                            className={
                              remainingAuditoriumQuantity === 0
                                ? "btn-success btn-disabled"
                                : "btn-success btn-plus"
                            }
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={
                              item.quantity === 0
                                ? "btn-warning btn-disabled"
                                : "btn-warning btn-plus"
                            }
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &#8211;
                          </button>

                          <span className="selected_count">
                            {item.quantity}
                          </span>

                          <button
                            className={
                              item.quantity === 10
                                ? "btn-success btn-disabled"
                                : "btn-success btn-plus"
                            }
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="total_cost">Venue Cost: ${venueTotalCost}</div>
            </div>

            {/* Meals */}
            <div id="meals" className="venue_container container_main">
              <div className="text">
                <h1>Meals Selection</h1>
              </div>

              <div className="meal_selection">
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
              </div>

              <div className="total_cost">Meal Cost: ${mealTotalCost}</div>
            </div>

            <div className="total_cost">
              Combined Total: ${combinedTotalCost}
            </div>
          </div>
        ) : (
          <div className="total_amount_detail">
            <TotalCost
              totalCosts={combinedTotalCost}
              handleClick={handleToggleItems}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenceEvent;
