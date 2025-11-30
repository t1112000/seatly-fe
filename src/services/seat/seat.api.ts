import Api from "..";
import { Seat } from "./seat.type";

export const fetchSeats = () => Api.get<{ data: Seat[] }>("/v1/seats");
