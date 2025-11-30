import { Crown, Heart, Lock, Ticket, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchSeats } from "../services/seat/seat.api";
import { Seat, SeatStatusEnum, SeatTypeEnum } from "../services/seat/seat.type";

interface SeatSelectionProps {
  onContinue: (seats: Seat[]) => void;
  onViewBookings: () => void;
  onLogout: () => void;
}

export function SeatSelection({
  onContinue,
  onViewBookings,
  onLogout,
}: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchSeats()
      .then((res) => {
        const data = res.data.data;
        if (!Array.isArray(data)) {
          setLoadError("Invalid seats payload");
          return;
        }

        setSeats(data);
        setLoadError(null);
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : "Failed to load seats";
        setLoadError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Group seats by row_label
  const seatsByRow = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row_label]) {
        grouped[seat.row_label] = [];
      }
      grouped[seat.row_label].push(seat);
    });
    // Sort seats in each row by col_number
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => a.col_number - b.col_number);
    });
    return grouped;
  }, [seats]);

  // Get unique row labels sorted
  const rowLabels = useMemo(() => {
    return Object.keys(seatsByRow).sort();
  }, [seatsByRow]);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeats((prev) => {
      if (prev.some((s) => s.id === seat.id)) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + Number(seat.price),
    0
  );

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      onContinue(selectedSeats);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="bg-[#1A2235] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl text-white">Seatly</h1>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onViewBookings}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              <Ticket className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">My Bookings</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 md:py-8">
        {loadError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {loadError}
          </div>
        )}
        {isLoading && (
          <div className="mb-4 rounded-xl border border-slate-800 bg-[#1A2235] px-4 py-3 text-sm text-slate-300">
            Loading seats...
          </div>
        )}
        <div className="mb-4 md:mb-8">
          <h2 className="text-xl md:text-2xl text-white mb-1 md:mb-2">
            Select Your Seats
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Choose your preferred seats from the available options
          </p>
        </div>

        {/* Legend */}
        <div className="mb-4 md:mb-8 p-3 md:p-6 bg-[#1A2235] rounded-xl border border-slate-800">
          <div className="mb-3 md:mb-4">
            <h3 className="text-sm md:text-base text-white mb-2 md:mb-3">
              Seat Types
            </h3>
            <div className="flex flex-wrap gap-3 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white/40 rounded-lg"></div>
                <div>
                  <div className="text-xs md:text-sm text-slate-200">
                    Standard
                  </div>
                  <div className="text-xs text-slate-400">120.000 VND</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-yellow-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-xs md:text-sm text-slate-200">VIP</div>
                  <div className="text-xs text-slate-400">150.000 VND</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-8 md:w-20 md:h-10 border-2 border-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                </div>
                <div>
                  <div className="text-xs md:text-sm text-slate-200">
                    Couple
                  </div>
                  <div className="text-xs text-slate-400">200.000 VND</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-3 md:pt-4 mt-3 md:mt-4">
            <h3 className="text-sm md:text-base text-white mb-2 md:mb-3">
              Seat Status
            </h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white/30 rounded-lg flex-shrink-0"></div>
                <span className="text-xs md:text-sm text-slate-300">
                  Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#4F46E5] rounded-lg flex-shrink-0"></div>
                <span className="text-xs md:text-sm text-slate-300">
                  Selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-700 rounded-lg opacity-50 flex-shrink-0"></div>
                <span className="text-xs md:text-sm text-slate-300">
                  Booked
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                </div>
                <span className="text-xs md:text-sm text-slate-300">
                  Locked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Screen indicator */}
        <div className="mb-4 md:mb-8">
          <div className="w-full max-w-2xl mx-auto">
            <div className="h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent rounded-full mb-2"></div>
            <p className="text-center text-slate-500 text-xs md:text-sm">
              SCREEN
            </p>
          </div>
        </div>

        {/* Seat Grid - Scrollable on mobile */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[600px] md:min-w-0 max-w-4xl mx-auto">
            <div className="grid grid-cols-[auto_1fr] gap-2 md:gap-4">
              {/* Row Labels */}
              <div className="flex flex-col gap-1.5 md:gap-2 pt-6 md:pt-8">
                {rowLabels.map((row) => (
                  <div
                    key={row}
                    className="h-10 md:h-12 flex items-center justify-center"
                  >
                    <span className="text-xs md:text-sm text-slate-400">
                      {row}
                    </span>
                  </div>
                ))}
              </div>

              {/* Seats */}
              <div className="grid gap-1.5 md:gap-2">
                {rowLabels.map((row) => {
                  const rowSeats = seatsByRow[row];
                  if (!rowSeats || rowSeats.length === 0) return null;

                  // Determine seat type from first seat in row
                  const seatType = rowSeats[0]?.type;
                  const isCoupleRow = seatType === SeatTypeEnum.COUPLE;
                  const isVIPRow = seatType === SeatTypeEnum.VIP;
                  const isStandardRow = seatType === SeatTypeEnum.STANDARD;

                  // Find max col_number to determine grid columns
                  const maxCol = Math.max(...rowSeats.map((s) => s.col_number));
                  const gridCols = isCoupleRow ? 10 : maxCol;

                  return (
                    <div
                      key={row}
                      className="grid gap-1.5 md:gap-2"
                      style={{
                        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                      }}
                    >
                      {rowSeats.map((seat) => {
                        const isAvailable =
                          seat.status === SeatStatusEnum.AVAILABLE;
                        const isSelected = selectedSeats.some(
                          (s) => s.id === seat.id
                        );
                        const isBooked = seat.status === SeatStatusEnum.BOOKED;
                        const isBlocked = seat.status === SeatStatusEnum.LOCKED;

                        return (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={isBooked || isBlocked}
                            className={`
                              ${isCoupleRow ? "col-span-2" : ""}
                              h-10 md:h-12 rounded-md md:rounded-lg transition-all duration-200 relative
                              ${
                                isAvailable && isStandardRow
                                  ? "border-2 border-white/40 hover:border-white/60 active:scale-95 md:hover:scale-105"
                                  : ""
                              }
                              ${
                                isAvailable && isVIPRow
                                  ? "border-2 border-yellow-500/60 hover:border-yellow-500 active:scale-95 md:hover:scale-105"
                                  : ""
                              }
                              ${
                                isAvailable && isCoupleRow
                                  ? "border-2 border-pink-500/60 hover:border-pink-500 active:scale-95 md:hover:scale-105"
                                  : ""
                              }
                              ${
                                isSelected && isStandardRow
                                  ? "bg-[#4F46E5] hover:bg-[#4338CA] scale-95 md:scale-105 shadow-lg shadow-indigo-500/50"
                                  : ""
                              }
                              ${
                                isSelected && isVIPRow
                                  ? "bg-[#4F46E5] hover:bg-[#4338CA] scale-95 md:scale-105 shadow-lg shadow-indigo-500/50 border-2 border-yellow-500"
                                  : ""
                              }
                              ${
                                isSelected && isCoupleRow
                                  ? "bg-[#4F46E5] hover:bg-[#4338CA] scale-95 md:scale-105 shadow-lg shadow-indigo-500/50 border-2 border-pink-500"
                                  : ""
                              }
                              ${
                                isBooked
                                  ? "bg-slate-700 opacity-50 cursor-not-allowed"
                                  : ""
                              }
                              ${
                                isBlocked
                                  ? "border-2 border-red-500 cursor-not-allowed"
                                  : ""
                              }
                            `}
                          >
                            {isAvailable && isVIPRow && (
                              <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            )}
                            {isSelected && isVIPRow && (
                              <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            )}
                            {isAvailable && isCoupleRow && (
                              <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            )}
                            {isSelected && isCoupleRow && (
                              <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            )}
                            {isBlocked && (
                              <Lock className="w-3 h-3 md:w-4 md:h-4 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="md:hidden text-center mt-2">
          <p className="text-xs text-slate-500">← Swipe to see all seats →</p>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1A2235] border-t border-slate-800 shadow-2xl">
          <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-6">
            <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
              <div className="flex-1 min-w-[120px] md:min-w-[200px]">
                <div className="text-slate-400 text-xs md:text-sm mb-1">
                  Selected Seats
                </div>
                <div className="text-white flex flex-wrap gap-1 md:gap-2 max-h-16 md:max-h-20 overflow-y-auto">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 bg-[#4F46E5]/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs md:text-sm whitespace-nowrap"
                    >
                      {s.seat_number}
                      <span className="text-slate-400 hidden sm:inline">
                        ({s.type})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-xs md:text-sm mb-1">
                  Total ({selectedSeats.length})
                </div>
                <div className="text-xl md:text-3xl text-white">
                  {totalPrice.toLocaleString()} VND
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 md:px-8 py-2.5 md:py-4 rounded-lg md:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap text-sm md:text-base"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
