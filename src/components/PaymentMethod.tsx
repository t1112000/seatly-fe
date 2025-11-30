import { ArrowLeft, Check, CreditCard, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { createBooking } from "../services/booking/booking.api";
import { Seat } from "../services/seat/seat.type";
import { PaymentOption } from "../services/booking";

interface PaymentMethodProps {
  selectedSeats: Seat[];
  onBack: () => void;
}

export function PaymentMethod({ selectedSeats, onBack }: PaymentMethodProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPrice = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + Number(seat.price ?? 0), 0),
    [selectedSeats]
  );

  const handlePayNow = async () => {
    if (!selectedPayment || selectedSeats.length === 0) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const payload = {
        seat_ids: selectedSeats.map((seat) => seat.id),
        payment_method: selectedPayment,
      };
      console.log("payload", payload);
      const { data } = await createBooking(payload);
      const paymentLink = data.data.payment_url;
      console.log("paymentLink", paymentLink);
      window.location.href = paymentLink;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment failed";
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#1A2235] border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl text-white">Payment</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Booking Summary */}
        <div className="bg-[#1A2235] rounded-2xl p-6 mb-6 border border-slate-800">
          <h2 className="text-xl text-white mb-4">Booking Summary</h2>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-slate-300">
              <span>Selected Seats</span>
              <span className="text-white">
                {selectedSeats.map((seat) => seat.seat_number).join(", ")}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Number of Seats</span>
              <span className="text-white">{selectedSeats.length}</span>
            </div>
            {selectedSeats.length > 0 && (
              <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-[#141A2A]">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between px-3 py-2 text-sm text-slate-300"
                  >
                    <span className="text-white">
                      {seat.seat_number} ({seat.type})
                    </span>
                    <span>{Number(seat.price)?.toLocaleString()} VND</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-700 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl text-white">Total Amount</span>
              <span className="text-3xl text-white">
                {totalPrice.toLocaleString()} VND
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h2 className="text-xl text-white mb-4">Select Payment Method</h2>

          <div className="space-y-4">
            {/* Stripe Option */}
            <button
              onClick={() => setSelectedPayment(PaymentOption.STRIPE)}
              className={`
                w-full bg-[#1A2235] hover:bg-[#1F2943] rounded-2xl p-6 border-2 transition-all duration-200
                ${
                  selectedPayment === PaymentOption.STRIPE
                    ? "border-[#4F46E5] shadow-lg shadow-indigo-500/20"
                    : "border-slate-800"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#635BFF]/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-[#635BFF]" />
                  </div>
                  <div className="text-left">
                    <div className="text-white">Credit / Debit Card</div>
                    <div className="text-slate-400 text-sm">
                      Powered by Stripe
                    </div>
                  </div>
                </div>
                {selectedPayment === PaymentOption.STRIPE && (
                  <div className="w-8 h-8 bg-[#4F46E5] rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </button>

            {/* Momo Option */}
            <button
              onClick={() => setSelectedPayment(PaymentOption.MOMO)}
              className={`
                w-full bg-[#1A2235] hover:bg-[#1F2943] rounded-2xl p-6 border-2 transition-all duration-200
                ${
                  selectedPayment === PaymentOption.MOMO
                    ? "border-[#4F46E5] shadow-lg shadow-indigo-500/20"
                    : "border-slate-800"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-pink-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-white">Mobile Money</div>
                    <div className="text-slate-400 text-sm">Momo Wallet</div>
                  </div>
                </div>
                {selectedPayment === PaymentOption.MOMO && (
                  <div className="w-8 h-8 bg-[#4F46E5] rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Pay Now Button */}
        <button
          onClick={handlePayNow}
          disabled={!selectedPayment || isProcessing}
          className={`
            w-full py-5 rounded-xl text-lg transition-all duration-200
            ${
              selectedPayment && !isProcessing
                ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg hover:shadow-xl"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          {isProcessing
            ? "Processing..."
            : `Pay Now ${totalPrice.toLocaleString()} VND`}
        </button>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        <p className="text-center text-slate-500 text-sm mt-4">
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
}
