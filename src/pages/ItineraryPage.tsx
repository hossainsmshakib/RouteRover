import React from "react";
import ItineraryList from "../components/itinerary/ItineraryList";

const ItineraryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <ItineraryList />
      </div>
    </div>
  );
};

export default ItineraryPage;
