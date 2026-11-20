import DataTable, { type Column } from "../components/DataTable"
import type { Car } from "../types/car"

const cars: Car[] = [
    {
        "id": "7453a196-bbf8-4a3e-a614-0d2a213c5ff3",
        "licensePlate": "3กข 1234",
        "province": "กรุงเทพมหานคร",
        "brand": "Toyota",
        "model": "Camry",
        "year": 2022,
        "color": "ขาว",
        "remark": "รถผู้บริหาร",
        "createdAt": "2026-11-20T14:23:15.163Z",
        "updatedAt": "2026-11-20T14:23:15.163Z",
        "deletedAt": null
    }
]
const columns: Column<Car>[] = [
    { header: 'ทะเบียน', render: (car) => car.licensePlate },
    { header: 'จังหวัด', render: (car) => car.province },
    { header: 'ยี่ห้อ / รุ่น', render: (car) => `${car.brand} / ${car.model}` },
    { header: 'ปี', render: (car) => car.year },
    { header: 'สี', render: (car) => car.color },
    { header: 'หมายเหตุ', render: (car) => car.remark ?? "-" },
]

export default function CarsPage() {
    return <DataTable columns={columns} rows={cars} rowKey={(car) => car.id} />
}