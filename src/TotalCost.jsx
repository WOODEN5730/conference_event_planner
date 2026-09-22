import { useSelector } from "react-redux";

const TotalCost = () => {
  const venueItems = useSelector(state => state.venue);   // array
  const avItems = useSelector(state => state.av);         // array

  const safeVenueItems = Array.isArray(venueItems) ? venueItems : [];
  const safeAvItems = Array.isArray(avItems) ? avItems : [];

  let total = 0;

  safeVenueItems.forEach(item => {
    total += item.quantity * item.cost;
  });

  safeAvItems.forEach(item => {
    total += item.quantity * item.cost;
  });

  return <div>Total Cost: ${total}</div>;
};

export default TotalCost;
