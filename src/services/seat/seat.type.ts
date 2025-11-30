export enum SeatStatusEnum {
  AVAILABLE = "AVAILABLE",
  LOCKED = "LOCKED",
  BOOKED = "BOOKED",
}

export enum SeatTypeEnum {
  VIP = "VIP",
  STANDARD = "STANDARD",
  COUPLE = "COUPLE",
}

export interface Seat {
  id: string;
  seat_number: string;
  type: SeatTypeEnum;
  row_label: string;
  col_number: number;
  price: number;
  status: SeatStatusEnum;
  version: number;
}
