export type Car = {
  id: string;
  licensePlate: string;
  province: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  remark: string | null;
  createdAt: string | "";
  updatedAt: string | "";
  deletedAt: string | null;
};

export type CarCreate = {
  licensePlate: string;
  province: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  remark: string | null;
};

export type CarWhere = {
  province?: string;
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
};

export type SearchCarReq = {
  where?: CarWhere;
  order_by?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  keyword?: string;
};