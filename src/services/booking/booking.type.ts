import { Seat } from "../seat/seat.type";

export enum PaymentOption {
  STRIPE = "STRIPE",
  MOMO = "MOMO",
}

export enum BookingStatusEnum {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAID = "PAID",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
}

export interface User {
  id: string;
  email?: string;
  name?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  user?: User;
  seats: Seat[];
  amount: number;
  status: BookingStatusEnum;
  payment_provider?: string;
  provider_session_id?: string;
  provider_transaction_id?: string;
  expires_at?: Date;
}

export interface CreateBookingPayload {
  seat_ids: string[];
  payment_method: PaymentOption;
}
