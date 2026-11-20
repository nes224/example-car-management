import { api } from "./client";
import type { Car } from "../types/car";

export type CarInput = Omit<Car, "id">;
export type CarFormState = Omit<Car, "year"> & { year: string };

export const carsApi = {
  create: (input: CarFormState) =>
    api<Car>("/cars", { method: "POST", body: JSON.stringify(input) }),
  getById: (id: string) => api<Car>(`/cars/${id}`, { method: "GET" }),
  update: (id: string, input: Partial<CarInput>) =>
    api<Car>(`/cars/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteById: (id: string) => api<Car>(`/cars/${id}`, { method: "DELETE" }),
};
