import Api from "..";
import { Booking, CreateBookingPayload } from "./booking.type";

export const fetchMyBookings = (params?: {
  offset?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.offset !== undefined) {
    queryParams.append("offset", params.offset.toString());
  }
  if (params?.limit !== undefined) {
    queryParams.append("limit", params.limit.toString());
  }
  const queryString = queryParams.toString();
  const url = `/v1/bookings/my-history${queryString ? `?${queryString}` : ""}`;
  return Api.get<{ data: Booking[]; total?: number }>(url);
};

export const createBooking = (payload: CreateBookingPayload) =>
  Api.post<{ data: { payment_url: string } }>("/v1/bookings", payload);

export const fetchBookingDetail = (bookingId: string) =>
  Api.get<{ data: Booking }>(`/v1/bookings/${bookingId}`);
