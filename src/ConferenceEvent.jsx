import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";

const ConferenceEvent = () => {
  const [showItems, setShowItems] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const venueState = useSelector((state) => state.venue);
  const avState = useSelector((state) => state.av);

  const getItemsArray = (sliceState) => {
    if (Array.isArray(sliceState)) {
      return sliceState;
    }

    if (Array.isArray(sliceState?.items)) {
      return sliceState.items;
    }

    if (Array.isArray(sliceState?.venueItems)) {
      return sliceState.venueItems;
    }

    if (Array.isArray(sliceState?.avItems)) {
      return sliceState.avItems;
    }

    return [];
  };

  const venueItems = getItemsArray(venueState);
  const avItems = getItemsArray(avState);

  const dispatch = useDispatch();

  const auditorium = venueItems.find(
    (item) => item.name === "Auditorium Hall (Capacity:200)"
  );

  const remainingAuditoriumQuantity = auditorium
    ? Math.max(0, 3 - auditorium.quantity)
    : 0;

  const handleToggleItems = () => {
    setShowItems((previousShowItems) => !previousShowItems);
  };

  const handleAddToCart = (index) => {
    const item = venueItems[index];

    if (!item) return;

    const isAuditorium =
      item.name === "Auditorium Hall (Capacity:200)";

    const maxQuantity = isAuditorium ? 3 : 10;

    if (item.quantity >= maxQuantity) return;

    dispatch(incrementQuantity(index));
  };

  const handleRemoveFromCart = (index) => {
    const item = venueItems[index];

    if (item && item.quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  const handleIncrementAvQuantity = (index) => {
    const item = avItems[index];

    if (item) {
      dispatch(incrementAvQuantity(index));
    }
  };

  const handleDecrementAvQuantity = (index) => {
    const item = avItems[index];

    if (item && item.quantity > 0) {
      dispatch(decrementAvQuantity(index));
    }
  };

  const calculateTotalCost = (items) => {
    if (!Array.isArray(items)) {
      return 0;
    }

    return items.reduce((total, item) => {
      const cost = Number(item.cost) || 0;
      const quantity = Number(item.quantity) || 0;

      return total + cost * quantity;
    }, 0);
  };

  const venueTotalCost = calculateTotalCost(venueItems);
  const avTotalCost = calculateTotalCost(avItems);
  const totalCosts = venueTotalCost + avTotalCost;

  const getItemsFromTotalCost = () => {
    const selectedVenueItems = venueItems
      .filter((item) => Number(item.quantity) > 0)
      .map((item) => ({
        ...item,
        category: "Venue",
        subtotal: (Number(item.cost) || 0) * (Number(item.quantity) || 0),
      }));

    const selectedAvItems = avItems
      .filter((item) => Number(item.quantity) > 0)
      .map((item) => ({
        ...item,
        category: "Add-on",
        subtotal: (Number(item.cost) || 0) * (Number(item.quantity) || 0),
      }));

    return [...selectedVenueItems, ...selectedAvItems];
  };

  const items = getItemsFromTotalCost();

  const ItemsDisplay = ({ items }) => {
    if (!items || items.length === 0) {
      return <p>No items selected.</p>;
    }

    return (
      <div className="selected-items">
        {items.map((item) => (
          <div
            className="selected-item"
            key={`${item.category}-${item.name}`}
          >
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>${item.subtotal}</span>
          </div>
        ))}
      </div>
    );
  };

  const navigateToProducts = () => {
    if (showItems) {
      setShowItems(false);
    }
  };

  return (
    <>
      <nav className="navbar_event_conference">
        <div className="company_logo">Conference Expense Planner</div>

        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={navigateToProducts}>
              Venue
            </a>

            <a href="#addons" onClick={navigateToProducts}>
              Add-ons
            </a>

            <a href="#meals" onClick={navigateToProducts}>
              Meals
            </a>
          </div>

          <button
            className="details_button"
            onClick={handleToggleItems}
          >
            {showItems ? "Back to Selections" : "Show Details"}
          </button>
        </div>
      </nav>

      <div className="main_container">
        {!showItems ? (
          <div className="items-information">
            <div id="venue" className="venue_container container_main">
              <div className="text">
                <h1>Venue Room Selection</h1>
              </div>

              <div className="venue_selection">
                {venueItems.map((item, index) => {
                  const isAuditorium =
                    item.name === "Auditorium Hall (Capacity:200)";

                  const maxQuantity = isAuditorium ? 3 : 10;
                  const isAtMaximum =
                    Number(item.quantity) >= maxQuantity;

                  return (
                    <div className="venue_main" key={item.name}>
                      <div className="img">
                        <img src={item.img} alt={item.name} />
                      </div>

                      <div className="text">{item.name}</div>

                      <div>${item.cost}</div>

                      <div className="button_container">
                        <button
                          className={
                            Number(item.quantity) === 0
                              ? "btn-warning btn-disabled"
                              : "btn-minus btn-warning"
                          }
                          onClick={() => handleRemoveFromCart(index)}
                          disabled={Number(item.quantity) === 0}
                        >
                          −
                        </button>

                        <span className="selected_count">
                          {Number(item.quantity) || 0}
                        </span>

                        <button
                          className={
                            isAtMaximum
                              ? "btn-success btn-disabled"
                              : "btn-success btn-plus"
                          }
                          onClick={() => handleAddToCart(index)}
                          disabled={isAtMaximum}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="total_cost">
                Total Cost: ${venueTotalCost}
              </div>

              {auditorium && (
                <p className="availability">
                  Auditorium rooms remaining:{" "}
                  {remainingAuditoriumQuantity}
                </p>
              )}
            </div>

            <div id="addons" className="venue_container container_main">
              <div className="text">
                <h1>Add-ons Selection</h1>
              </div>

              <div className="addons_selection">
                {avItems.map((item, index) => (
                  <div className="av_data venue_main" key={item.name}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>

                    <div className="text">{item.name}</div>

                    <div>${item.cost}</div>

                    <div className="addons_btn">
                      <button
                        className="btn-warning"
                        onClick={() =>
                          handleDecrementAvQuantity(index)
                        }
                        disabled={Number(item.quantity) === 0}
                      >
                        −
                      </button>

                      <span className="quantity-value">
                        {Number(item.quantity) || 0}
                      </span>

                      <button
                        className="btn-success"
                        onClick={() =>
                          handleIncrementAvQuantity(index)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="total_cost">
                Total Cost: ${avTotalCost}
              </div>
            </div>

            <div id="meals" className="venue_container container_main">
              <div className="text">
                <h1>Meals Selection</h1>
              </div>

              <div className="input-container venue_selection">
                <label htmlFor="numberOfPeople">
                  Number of attendees:
                </label>

                <input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  value={numberOfPeople}
                  onChange={(event) => {
                    setNumberOfPeople(
                      Math.max(1, Number(event.target.value) || 1)
                    );
                  }}
                />
              </div>

              <div className="meal_selection">
                <p>Meal options will appear here.</p>
              </div>

              <div className="total_cost">Total Cost: $0</div>
            </div>
          </div>
        ) : (
          <div className="total_amount_detail">
            <TotalCost
              totalCosts={totalCosts}
              handleClick={handleToggleItems}
              ItemsDisplay={() => <ItemsDisplay items={items} />}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenceEvent;