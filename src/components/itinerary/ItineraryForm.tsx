import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  addItinerary,
  updateItinerary,
  setCurrentItinerary,
} from "../../redux/slices/itinerarySlice";
import { AppDispatch, RootState } from "../../redux/store";
import { Itinerary, Destination } from "../../types/itinerary";
import useDistanceCalculation from "./useDistanceCalculation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const customIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ItineraryForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const currentItinerary = useSelector(
    (state: RootState) => state.itinerary.currentItinerary
  );
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  const { getDistanceBetween } = useDistanceCalculation(destinations);

  useEffect(() => {
    if (currentItinerary) {
      setName(currentItinerary.name);
      setStartDate(currentItinerary.startDate);
      setEndDate(currentItinerary.endDate);
      setDescription(currentItinerary.description);
      setDestinations(currentItinerary.destinations || []);
    } else {
      setName("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setDestinations([]);
    }
  }, [currentItinerary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (userId === undefined) {
      setError("User not logged in");
      return;
    }
    try {
      const itineraryData: Omit<Itinerary, "id"> = {
        userId,
        name,
        startDate,
        endDate,
        description,
        destinations,
      };
      if (currentItinerary) {
        await dispatch(
          updateItinerary({ ...currentItinerary, ...itineraryData })
        ).unwrap();
      } else {
        await dispatch(addItinerary(itineraryData)).unwrap();
      }
      handleClose();
    } catch (error: unknown) {
      console.error("Failed to save itinerary:", error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleClose = () => {
    onClose();
    dispatch(setCurrentItinerary(null));
  };

  const handleAddDestination = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const newDestination: Destination = {
      id: Date.now().toString(),
      name: `Destination ${destinations.length + 1}`,
      activities: [],
      lat,
      lng,
    };
    setDestinations([...destinations, newDestination]);
  };

  const MapEvents = () => {
    useMapEvents({
      click: handleAddDestination,
    });
    return null;
  };

  const mapCenter: LatLngExpression = [0, 0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          {currentItinerary ? "Edit" : "Create"} Itinerary
        </h3>
        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "details"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "map"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("map")}
            >
              Map
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "route"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("route")}
            >
              Route
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "details" && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Trip Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  rows={3}
                ></textarea>
              </div>
            </>
          )}
          {activeTab === "map" && (
            <div className="h-96 w-full">
              <MapContainer
                center={mapCenter}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {destinations.map((destination) => (
                  <Marker
                    key={destination.id}
                    position={[destination.lat || 0, destination.lng || 0]}
                    icon={customIcon}
                  >
                    <Popup>{destination.name}</Popup>
                  </Marker>
                ))}
                <Polyline
                  positions={destinations.map(
                    (dest) => [dest.lat || 0, dest.lng || 0] as LatLngExpression
                  )}
                />
                <MapEvents />
              </MapContainer>
            </div>
          )}
          {activeTab === "route" && (
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-700">
                Travel Route
              </h4>
              {destinations.map((destination, index) => (
                <div key={destination.id} className="bg-gray-50 p-2 rounded">
                  <p className="font-medium">
                    {destination.name} ({destination.lat?.toFixed(4)},{" "}
                    {destination.lng?.toFixed(4)})
                  </p>
                  {index < destinations.length - 1 && (
                    <p className="text-sm text-gray-500">
                      Distance to next:{" "}
                      {getDistanceBetween(index, index + 1).toFixed(2)} km
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {currentItinerary ? "Update" : "Create"} Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryForm;
