export class CarRspDto {
  id: string;
  licensePlate: string;
  province: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  remark: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
