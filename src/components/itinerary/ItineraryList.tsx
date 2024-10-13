import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchItineraries,
  deleteItinerary,
  setCurrentItinerary,
} from "../../redux/slices/itinerarySlice";
import ItineraryItem from "./ItineraryItem";
import ItineraryForm from "./ItineraryForm";
import {
  FaPlus,
  FaSearch,
  FaCalendarAlt,
  FaSortAmountDown,
  FaUndo,
} from "react-icons/fa";

const ItineraryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const itineraries = useSelector(
    (state: RootState) => state.itinerary.itineraries
  );
  const loading = useSelector((state: RootState) => state.itinerary.loading);
  const error = useSelector((state: RootState) => state.itinerary.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    if (userId !== undefined) {
      dispatch(fetchItineraries(userId));
    }
  }, [dispatch, userId]);

  const handleEdit = (id: string) => {
    const itineraryToEdit = itineraries.find((i) => i.id === id);
    if (itineraryToEdit) {
      dispatch(setCurrentItinerary(itineraryToEdit));
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      dispatch(deleteItinerary(id));
    }
  };

  const handleOpenCreateModal = () => {
    dispatch(setCurrentItinerary(null));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setSortBy("name");
  };

  const filteredAndSortedItineraries = itineraries
    .filter((itinerary) =>
      itinerary.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((itinerary) =>
      dateFilter ? itinerary.startDate.includes(dateFilter) : true
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "startDate") {
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      }
      return 0;
    });

  if (userId === undefined)
    return (
      <div className="text-center text-gray-600">
        Please log in to view itineraries
      </div>
    );
  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center transition duration-300 ease-in-out"
        >
          <FaPlus className="mr-2" />
          New Itinerary
        </button>
        <div className="flex-grow flex items-center space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by trip name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="name">Sort by Name</option>
              <option value="startDate">Sort by Start Date</option>
            </select>
            <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center transition duration-300 ease-in-out"
        >
          <FaUndo className="mr-2" />
          Reset
        </button>
      </div>
      {filteredAndSortedItineraries.length === 0 ? (
        <div className="text-center text-gray-600 bg-white shadow-sm rounded-lg p-8">
          <p className="text-xl font-semibold mb-2">No itineraries found</p>
          <p>Create a new itinerary to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedItineraries.map((itinerary) => (
            <ItineraryItem
              key={itinerary.id}
              itinerary={itinerary}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <ItineraryForm isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ItineraryList;
