import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import ItineraryPage from "./pages/ItineraryPage";
import ItinerarySummaryPage from "./pages/ItinerarySummaryPage"; // Add this import
import { checkAuthStatus } from "./redux/slices/authSlice";
import { fetchItineraries } from "./redux/slices/itinerarySlice";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && userId !== undefined) {
      dispatch(fetchItineraries(userId));
    }
  }, [isAuthenticated, userId, dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto p-4 flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/itinerary"
              element={<PrivateRoute element={<ItineraryPage />} />}
            />
            <Route
              path="/summary"
              element={<PrivateRoute element={<ItinerarySummaryPage />} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
