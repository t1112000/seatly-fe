import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BookingHistory } from "./components/BookingHistory";
import { LoginScreen } from "./components/LoginScreen";
import { PaymentMethod } from "./components/PaymentMethod";
import { PaymentResult } from "./components/PaymentResult";
import { SeatSelection } from "./components/SeatSelection";
import { fetchCurrentUser, logout } from "./services/auth";
import { Seat } from "./services/seat";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      // Skip check nếu đang ở login page
      if (location.pathname === "/login") {
        setIsAuthChecked(true);
        return;
      }

      fetchCurrentUser()
        .then(() => {
          setIsLoggedIn(true);
        })
        .catch(() => {
          if (location.pathname !== "/login") {
            setIsLoggedIn(false);
            navigate("/login", { replace: true });
          }
        })
        .finally(() => {
          setIsAuthChecked(true);
        });
    })();
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (isAuthChecked && !isLoggedIn && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [isAuthChecked, isLoggedIn, location.pathname, navigate]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/seat-selection", { replace: true });
  };

  const handleContinueToPayment = (seats: Seat[]) => {
    setSelectedSeats(seats);
    navigate("/payment");
  };

  const extractBookingId = (booking: any): string | null => {
    if (!booking) return null;
    return (
      booking.id ||
      booking.booking_id ||
      booking.code ||
      booking.booking_code ||
      booking?.data?.id ||
      booking?.data?.booking_id ||
      null
    );
  };

  const handleViewBookings = () => {
    navigate("/booking-history");
  };

  const handleBackToSeats = () => {
    navigate("/seat-selection");
  };

  const handleLogout = () => {
    logout()
      .catch((error) => {
        console.error("Failed to logout", error);
      })
      .finally(() => {
        setIsLoggedIn(false);
        setSelectedSeats([]);
        navigate("/login", { replace: true });
      });
  };

  const renderProtected = (element: React.ReactElement) =>
    isLoggedIn ? element : <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#0F1629]">
      {!isAuthChecked ? (
        <div className="flex items-center justify-center min-h-screen text-white">
          Checking session...
        </div>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<LoginScreen onLogin={handleLogin} />}
          />

          <Route
            path="/seat-selection"
            element={renderProtected(
              <SeatSelection
                onContinue={handleContinueToPayment}
                onViewBookings={handleViewBookings}
                onLogout={handleLogout}
              />
            )}
          />

          <Route
            path="/payment"
            element={renderProtected(
              <PaymentMethod
                selectedSeats={selectedSeats}
                onBack={handleBackToSeats}
              />
            )}
          />

          <Route
            path="/payment-result"
            element={renderProtected(
              <PaymentResult onViewTickets={handleViewBookings} />
            )}
          />

          <Route
            path="/booking-history"
            element={renderProtected(
              <BookingHistory
                onBack={handleBackToSeats}
                onLogout={handleLogout}
              />
            )}
          />

          <Route
            path="*"
            element={
              <Navigate
                to={isLoggedIn ? "/seat-selection" : "/login"}
                replace
              />
            }
          />
        </Routes>
      )}
    </div>
  );
}
