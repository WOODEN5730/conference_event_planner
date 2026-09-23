import React, { useState } from "react";
import "./ConferenceEvent.css";

import TotalCost from "./TotalCost";

import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";

const ConferenceEvent = () => {
  const [showItems, setShowItems] = useState(false);

  // Always return an array — prevents .find() crash
 const venueItems = useSelector((state) => state.venue);

  const dispatch = useDispatch();

  // Safe auditorium lookup
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

  const calculateTotalCost = () => {
    return venueItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
  };

  const venueTotalCost = calculateTotalCost();

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

              <div className="total_cost">Total Cost: ${venueTotalCost}</div>
            </div>

            {/* Add-ons */}
            <div id="addons" className="venue_container container_main">
              <div className="text">
                <h1>Add-ons Selection</h1>
              </div>

              <div className="addons_selection"></div>

              <div className="total_cost">Total Cost:</div>
            </div>

            {/* Meals */}
            <div id="meals" className="venue_container container_main">
              <div className="text">
                <h1>Meals Selection</h1>
              </div>

              <div className="input-container venue_selection"></div>
              <div className="meal_selection"></div>

              <div className="total_cost">Total Cost:</div>
            </div>
          </div>
        ) : (
          <div className="total_amount_detail">
            <TotalCost
              totalCosts={venueTotalCost}
              handleClick={handleToggleItems}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenceEvent;
