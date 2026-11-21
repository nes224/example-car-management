import { api } from "./client";
import type { Car, CarCreate, SearchCarReq } from "../types/car";
import type { Paginated } from "../types/common";

export const carsApi = {
  search: (req: SearchCarReq) => api<Paginated<Car>>("/cars/search", { method: "POST", body: JSON.stringify(req)}),
  create: (input: CarCreate) => api<Car>("/cars", { method: "POST", body: JSON.stringify(input) }),
  getById: (id: string) => api<Car>(`/cars/${id}`, { method: "GET" }),
  update: (id: string, input: Partial<CarCreate>) => api<Car>(`/cars/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteById: (id: string) => api<Car>(`/cars/${id}`, { method: "DELETE" }),
};
