import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  FaClock,
  FaCalendar,
  FaPlane,
  FaMapMarkerAlt,
  FaSuitcase,
  FaGlobeAmericas,
} from "react-icons/fa";

const ItinerarySummary: React.FC = () => {
  const itineraries = useSelector(
    (state: RootState) => state.itinerary.itineraries
  );

  const upcomingTrips = itineraries.filter(
    (itinerary) => new Date(itinerary.startDate) > new Date()
  );

  const totalTravelTime = itineraries.reduce((total, itinerary) => {
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    return total + (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
  }, 0);

  const totalTrips = itineraries.length;
  const completedTrips = itineraries.filter(
    (itinerary) => new Date(itinerary.endDate) < new Date()
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-left text-gray-800">
        Travel Summary
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<FaSuitcase className="text-blue-600" />}
          title="Total Trips"
          value={totalTrips}
          color="bg-blue-500"
        />
        <StatCard
          icon={<FaClock className="text-green-600" />}
          title="Total Travel Days"
          value={Math.round(totalTravelTime)}
          color="bg-green-500"
        />
        <StatCard
          icon={<FaPlane className="text-purple-600" />}
          title="Upcoming Trips"
          value={upcomingTrips.length}
          color="bg-purple-500"
        />
        <StatCard
          icon={<FaGlobeAmericas className="text-red-600" />}
          title="Completed Trips"
          value={completedTrips}
          color="bg-red-500"
        />
      </div>
      <h2 className="text-2xl font-bold mb-6 text-left text-gray-800">
        Upcoming Adventures
      </h2>
      {upcomingTrips.length === 0 ? (
        <p className="text-gray-600 bg-white p-6 rounded-lg shadow-md text-left text-xl">
          No upcoming trips scheduled. Time to plan your next adventure!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
}> = ({ icon, title, value, color }) => (
  <div
    className={`${color} rounded-xl p-6 shadow-md text-white transition-transform hover:scale-105`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="text-4xl bg-white rounded-full p-3">{icon}</div>
      <div className="text-4xl font-bold">{value}</div>
    </div>
    <div className="font-medium text-left text-lg">{title}</div>
  </div>
);

const TripCard: React.FC<{ trip: any }> = ({ trip }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDurationInDays = (start: string, end: string) => {
    return Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 border border-gray-200">
      <div className="bg-blue-500 p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{trip.name}</h3>
        <span className="text-white text-sm bg-blue-600 px-2 py-1 rounded">
          {getDurationInDays(trip.startDate, trip.endDate)} days
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FaCalendar className="text-blue-500 mr-2" />
            <span className="text-gray-700 font-medium">Start</span>
          </div>
          <span className="text-gray-900">{formatDate(trip.startDate)}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FaCalendar className="text-red-500 mr-2" />
            <span className="text-gray-700 font-medium">End</span>
          </div>
          <span className="text-gray-900">{formatDate(trip.endDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySummary;
