import React, { useRef, useEffect, useState } from "react";
import { Itinerary, Destination } from "../../types/itinerary";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRoute,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaPlane,
} from "react-icons/fa";
import useDistanceCalculation from "./useDistanceCalculation";
import { format } from "date-fns";

interface Props {
  itinerary: Itinerary;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ItineraryItem: React.FC<Props> = ({ itinerary, onEdit, onDelete }) => {
  const validDestinations = itinerary.destinations.filter(
    (dest): dest is Destination => dest !== null && dest !== undefined
  );
  const { totalDistance, getDistanceBetween } =
    useDistanceCalculation(validDestinations);

  const destinationsRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (destinationsRef.current) {
        setIsScrollable(
          destinationsRef.current.scrollHeight >
            destinationsRef.current.clientHeight
        );
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, [validDestinations]);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-200 transition-all duration-300 hover:shadow-xl relative">
      <div className="bg-blue-600 p-6 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white truncate pr-16">
            {itinerary.name}
          </h3>
          <div className="absolute top-4 right-4 space-x-2">
            <button
              onClick={() => onEdit(itinerary.id)}
              className="text-white hover:text-blue-200 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
              aria-label="Edit itinerary"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={() => onDelete(itinerary.id)}
              className="text-white hover:text-blue-200 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
              aria-label="Delete itinerary"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center text-white text-sm">
          <FaCalendarAlt className="mr-2" />
          <span>
            {format(new Date(itinerary.startDate), "MMM d")} -{" "}
            {format(new Date(itinerary.endDate), "MMM d, yyyy")}
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {itinerary.description}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center bg-blue-50 rounded-lg p-3">
            <FaMapMarkerAlt className="mr-3 text-blue-500" size={20} />
            <div>
              <p className="text-xs font-semibold text-gray-600">
                Destinations
              </p>
              <p className="text-lg font-bold text-gray-800">
                {validDestinations.length}
              </p>
            </div>
          </div>
          <div className="flex items-center bg-blue-50 rounded-lg p-3">
            <FaRoute className="mr-3 text-blue-500" size={20} />
            <div>
              <p className="text-xs font-semibold text-gray-600">
                Total Distance
              </p>
              <p className="text-lg font-bold text-gray-800">
                {totalDistance.toFixed(0)} km
              </p>
            </div>
          </div>
        </div>
        <div
          ref={destinationsRef}
          className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide"
        >
          {validDestinations.map((dest, index) => (
            <div
              key={dest.id}
              className="flex items-center justify-between py-2 border-b border-blue-100 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaPlane className="text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {dest.name}
                </span>
              </div>
              {index < validDestinations.length - 1 && (
                <span className="text-xs font-semibold text-gray-600 bg-blue-100 px-2 py-1 rounded-full">
                  {getDistanceBetween(index, index + 1).toFixed(0)} km
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {isScrollable && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-blue-500 bg-white rounded-t-full px-3 pt-1 shadow-md">
          <FaChevronDown className="animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default ItineraryItem;
