import { CheckCircle, Ticket, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Booking, BookingStatusEnum } from "../services/booking";
import { fetchBookingDetail } from "../services/booking/booking.api";

interface PaymentResultProps {
  onViewTickets: () => void;
}

const formatDate = (value?: string | Date) => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function PaymentResult({ onViewTickets }: PaymentResultProps) {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const [detail, setDetail] = useState<Booking | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setDetailError("Booking ID is missing from URL");
      setIsDetailLoading(false);
      return;
    }

    setIsDetailLoading(true);
    setDetailError(null);

    fetchBookingDetail(bookingId)
      .then(({ data }) => {
        const booking = (data?.data ?? data) as Booking;
        setDetail(booking);
        setDetailError(null);
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to fetch booking details";
        setDetailError(message);
      })
      .finally(() => {
        setIsDetailLoading(false);
      });
  }, [bookingId]);

  const amountPaid = Number(detail?.amount) ?? 0;

  const isSuccess = detail?.status === BookingStatusEnum.PAID;

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle className="w-20 h-20 text-red-500" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-3xl text-white mb-2">Invalid Request</h1>
          <p className="text-slate-400 mb-8">Booking ID is missing from URL</p>
          <button
            onClick={onViewTickets}
            className="w-full bg-transparent border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white py-4 px-6 rounded-xl transition-all duration-200"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (isDetailLoading && !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-white text-lg mb-4">
            Loading booking details...
          </div>
          <div className="text-slate-400">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {isSuccess ? (
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle
                    className="w-20 h-20 text-green-500"
                    strokeWidth={2}
                  />
                </div>
                <div className="absolute inset-0 w-32 h-32 bg-green-500/20 rounded-full animate-ping"></div>
              </div>
            </div>

            <h1 className="text-3xl text-white mb-2">Payment Successful!</h1>
            <p className="text-slate-400 mb-8">
              Your tickets have been confirmed
            </p>

            <div className="bg-[#1A2235] rounded-2xl p-6 mb-6 border border-slate-800 text-left">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
                <div className="w-12 h-12 bg-[#4F46E5]/10 rounded-xl flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <div>
                  <div className="text-white">Ticket Confirmation</div>
                  <div className="text-slate-400 text-sm">#{detail?.id}</div>
                </div>
              </div>

              {isDetailLoading && (
                <div className="mb-3 text-sm text-slate-400">
                  Fetching booking details...
                </div>
              )}
              {detailError && (
                <div className="mb-3 text-sm text-red-500">{detailError}</div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Seats</span>
                  <span className="text-white">
                    {detail?.seats.map((seat) => seat.seat_number).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="text-white">
                    {formatDate(detail?.expires_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid</span>
                  <span className="text-white text-lg">
                    {amountPaid.toLocaleString()} VND
                  </span>
                </div>
                {detail?.status && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="text-white capitalize">
                      {detail.status.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </div>
                )}
                {detail?.payment_provider && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Method</span>
                    <span className="text-white">
                      {detail.payment_provider}
                    </span>
                  </div>
                )}
                {detail?.provider_transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction ID</span>
                    <span className="text-white text-sm font-mono">
                      {detail.provider_transaction_id.slice(0, 12)}...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onViewTickets}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View My Tickets
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-20 h-20 text-red-500" strokeWidth={2} />
                </div>
              </div>
            </div>

            <h1 className="text-3xl text-white mb-2">Payment Failed</h1>
            <p className="text-slate-400 mb-2">
              {detailError ??
                (detail?.status === BookingStatusEnum.FAILED
                  ? "Transaction was declined"
                  : detail?.status === BookingStatusEnum.EXPIRED
                  ? "Payment expired"
                  : "Transaction was declined")}
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Please check your payment method and try again
            </p>

            <div className="bg-[#1A2235] rounded-2xl p-6 mb-8 border border-red-500/20 text-left">
              <div className="space-y-3">
                {detail?.seats && detail?.seats.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seats</span>
                    <span className="text-white">
                      {detail?.seats.map((seat) => seat.seat_number).join(", ")}
                    </span>
                  </div>
                )}
                {amountPaid > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount</span>
                    <span className="text-white">
                      {amountPaid.toLocaleString()} VND
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-red-500">
                    {detail?.status ?? "Declined"}
                  </span>
                </div>
                {detail?.id && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Booking ID</span>
                    <span className="text-white text-sm">#{detail?.id}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onViewTickets}
              className="w-full bg-transparent border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white py-4 px-6 rounded-xl transition-all duration-200"
            >
              View My Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
