import { ArrowLeft, Calendar, CreditCard, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Booking, BookingStatusEnum } from "../services/booking";
import { fetchMyBookings } from "../services/booking/booking.api";
import { BookingPagination } from "./BookingPagination";

interface BookingHistoryProps {
  onBack: () => void;
  onLogout: () => void;
}

const ITEMS_PER_PAGE = 10;

export function BookingHistory({ onBack, onLogout }: BookingHistoryProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    setIsLoading(true);
    fetchMyBookings({ offset, limit: ITEMS_PER_PAGE })
      .then(({ data }) => {
        const bookings = data?.data ?? [];
        setBookings(bookings);
        setTotal(data?.total ?? bookings.length);
        setError(null);
      })
      .catch((err) => {
        const message =
          err instanceof Error ? err.message : "Failed to load bookings";
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [offset]);

  const confirmedCount = useMemo(
    () =>
      bookings.filter((booking) => booking.status === BookingStatusEnum.PAID)
        .length,
    [bookings]
  );

  const pendingCount = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.status === BookingStatusEnum.PENDING_PAYMENT
      ).length,
    [bookings]
  );

  const normalizeDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusColor = (status: BookingStatusEnum) => {
    switch (status) {
      case BookingStatusEnum.PAID:
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      case BookingStatusEnum.PENDING_PAYMENT:
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
      case BookingStatusEnum.FAILED:
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case BookingStatusEnum.EXPIRED:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const getStatusLabel = (status: BookingStatusEnum) => {
    switch (status) {
      case BookingStatusEnum.PAID:
        return "Paid";
      case BookingStatusEnum.PENDING_PAYMENT:
        return "Pending";
      case BookingStatusEnum.FAILED:
        return "Failed";
      case BookingStatusEnum.EXPIRED:
        return "Expired";
      default:
        return status;
    }
  };

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * ITEMS_PER_PAGE;
    setOffset(newOffset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#1A2235] border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl text-white">My Bookings</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
            >
              <User className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="rounded-xl border border-slate-800 bg-[#1A2235] px-4 py-6 text-center text-slate-300 py-10">
            Loading bookings...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-[#1A2235] p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <CreditCard className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-sm text-slate-400">Total Bookings</span>
                </div>
                <div className="text-3xl text-white">{total}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#1A2235] p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4F46E5]/10">
                    <Calendar className="h-5 w-5 text-[#4F46E5]" />
                  </div>
                  <span className="text-sm text-slate-400">PAID</span>
                </div>
                <div className="text-3xl text-white">{confirmedCount}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#1A2235] p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <CreditCard className="h-5 w-5 text-yellow-500" />
                  </div>
                  <span className="text-sm text-slate-400">Pending</span>
                </div>
                <div className="text-3xl text-white">{pendingCount}</div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#1A2235]">
              <div className="border-b border-slate-800 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl text-white">All Bookings</h2>
                  {total > 0 && (
                    <span className="text-sm text-slate-400">
                      Showing {offset + 1}-
                      {Math.min(offset + ITEMS_PER_PAGE, total)} of {total}
                    </span>
                  )}
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 transition-colors hover:bg-[#1F2943]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Booking Info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2 md:gap-3">
                          <h3 className="text-sm text-white md:text-base">
                            Booking #{booking.id}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs md:px-3 ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 md:gap-4 md:text-sm">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                            <span>
                              {normalizeDate(
                                booking.expires_at?.toString() ?? ""
                              )}
                            </span>
                          </div>
                          <div>
                            <span>Seats: </span>
                            <span className="text-white">
                              {booking.seats
                                .map((seat) => seat.seat_number)
                                .join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xl text-white md:text-2xl">
                          {Number(booking.amount).toLocaleString()} VND
                        </div>
                        <div className="text-xs text-slate-400 md:text-sm">
                          {booking.seats.length}{" "}
                          {booking.seats.length === 1 ? "seat" : "seats"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <BookingPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {/* Empty State */}
            {bookings.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                  <Calendar className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="mb-2 text-xl text-white">No bookings yet</h3>
                <p className="mb-6 text-slate-400">
                  Start by selecting your seats
                </p>
                <button
                  onClick={onBack}
                  className="rounded-xl bg-[#4F46E5] px-6 py-3 text-white transition-all duration-200 hover:bg-[#4338CA]"
                >
                  Book Now
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
