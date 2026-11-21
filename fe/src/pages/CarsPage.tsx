import { useState } from "react"
import DataTable, { type Column } from "../components/DataTable"
import Modal from "../components/Modal"
import type { Car, CarCreate } from "../types/car"
import CarForm from "../components/CarForm"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { carsApi } from "../api/cars"
import { useDebounce } from "../hook/useDebounce"

let PAGE_SIZE: number = 20;

const dataColumns: Column<Car>[] = [
    { header: 'ทะเบียน', render: (car) => car.licensePlate },
    { header: 'จังหวัด', render: (car) => car.province },
    { header: 'ยี่ห้อ / รุ่น', render: (car) => `${car.brand} / ${car.model}` },
    { header: 'ปี', render: (car) => car.year },
    { header: 'สี', render: (car) => car.color },
    { header: 'หมายเหตุ', render: (car) => car.remark ?? "-" },
]

export default function CarsPage() {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const [offset, setOffset] = useState(0);
    const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc")
    const [keyword, setKeyword] = useState("")
    const [carId, setcarId] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    const debouncedKeyword = useDebounce(keyword.trim(), 400)

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['cars', { offset, keyword: debouncedKeyword, orderBy }],
        queryFn: () => carsApi.search({
            limit: PAGE_SIZE,
            offset,
            order_by: orderBy,
            keyword: debouncedKeyword || "",
        }),
        placeholderData: keepPreviousData
    });
    const cars = data?.data.items ?? [];
    const total = data?.data.total ?? 0;

    const from = total === 0 ? 0 : offset + 1;
    const to = Math.min(offset + PAGE_SIZE, total)
    const hasPrev = offset > 0;
    const hasNext = offset + PAGE_SIZE < total;

    const createCar = useMutation({
        mutationFn: carsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cars"] })
            setIsOpen(false)
        },
    });

    const getCar = useQuery({
        queryKey: ["car", carId],
        queryFn: () => carsApi.getById(carId!),
        enabled: carId !== null,
    });

    const updateCar = useMutation({
        mutationFn: (input: CarCreate) => carsApi.update(carId!, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cars"] });
            queryClient.invalidateQueries({ queryKey: ["car", carId] });
            setIsUpdating(false);
        },
    });

    const deleteCar = useMutation({
        mutationFn: (id: string) => carsApi.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cars"] })
            closeDetail()
        },
    })

    const viewingCar = getCar.data?.data

    const columns: Column<Car>[] = [...dataColumns, {
        header: "",
        render: (car) => (
            <button
                type="button"
                onClick={() => setcarId(car.id)}
                className="text-sky-600 hover:underline"

            >
                ดู
            </button>
        ),
    }];

    const handleDelete = () => {
        if (!viewingCar) return
        if (!window.confirm(`ยืนยันการลบข้อมูล ${viewingCar.licensePlate}`)) return
        deleteCar.mutate(viewingCar.id)
    }

    const closeDetail = () => {
        setcarId(null)
        setIsUpdating(false)
        updateCar.reset()
        deleteCar.reset()
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            className="h-10 w-80 rounded-lg border border-gray-500 pl-9 pr-9 text-sm"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value)
                                setOffset(0)
                            }}
                        />
                        {keyword && (
                            <button
                                type="button"
                                onClick={() => {
                                    setKeyword("")
                                    setOffset(0)
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-800"
                            >
                                x
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <select
                            className="h-10 appearance-none rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-sky-500 focus:outline-none"
                            value={orderBy}
                            onChange={(e) => {
                                setOrderBy(e.target.value as "asc" | "desc")
                                setOffset(0)
                            }}
                        >
                            <option value="desc">ใหม่ ← เก่า</option>
                            <option value="asc">เก่า → ใหม่</option>
                        </select>
                    </div>
                    {isFetching && <span className="text-sm text-gray-400">กำลังค้นหา...</span>}
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
                    + เพิ่มรถ
                </button>
            </div>
            <DataTable columns={columns} rows={cars} rowKey={(car) => car.id} loading={isLoading} />
            <div className="flex items-center justify-between text-sm text-gray-800 mr-5">
                <span>แสดง {from}-{to} จาก {total} คัน</span>
                <div className="flex gap-2">
                    <button
                        disabled={!hasPrev}
                        onClick={() => setOffset(offset - PAGE_SIZE)}
                        className="rounded-lg border border-gray-200 px-3 py-1 hover:bg-gray-300 duration-200">
                        ← ก่อนหน้า
                    </button>
                    <button
                        disabled={!hasNext}
                        onClick={() => setOffset(offset - PAGE_SIZE)}
                        className="rounded-lg border border-gray-200 px-3 py-1  hover:bg-gray-300 duration-200">
                        ถัดไป →
                    </button>
                </div>
            </div>

            <Modal open={isOpen} title="เพิ่มรถ" onClose={() => setIsOpen(false)}>
                {createCar.error && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {createCar.error.message}
                    </div>
                )}
                <CarForm onSubmit={(input) => createCar.mutate(input)} />
            </Modal>

            <Modal open={carId !== null} title={isUpdating ? "แก้ไขรถ" : "รายละเอียดรถ"} onClose={closeDetail}>
                {getCar.isLoading && <p className="p-8 text-center text-gray-500">Is loading...</p>}
                {(getCar.error || updateCar.error || deleteCar.error) && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {(getCar.error ?? updateCar.error ?? deleteCar.error)?.message}
                    </div>
                )}

                {viewingCar && isUpdating && (
                    <CarForm
                        initial={toCarCreate(viewingCar)}
                        onSubmit={(input) => updateCar.mutate(input)}
                    />
                )}

                {viewingCar && !isUpdating && (
                    <>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <dt className="text-gray-800">ทะเบียน:</dt>
                            <dd>{viewingCar.licensePlate}</dd>
                            <dt className="text-gray-800">จังหวัด:</dt>
                            <dd>{viewingCar.province}</dd>
                            <dt className="text-gray-800">ยี่ห้อ / รุ่น:</dt>
                            <dd>{viewingCar.brand} / {viewingCar.model}</dd>
                            <dt className="text-gray-800">ปี:</dt>
                            <dd>{viewingCar.year}</dd>
                            <dt className="text-gray-800">สี:</dt>
                            <dd>{viewingCar.color}</dd>
                            <dt className="text-gray-800">หมายเหตุ:</dt>
                            <dd>{viewingCar.remark}</dd>
                        </dl>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                className="rounded-lg border border-red-300 px-4 py-2 text-red-600"
                                onClick={handleDelete}
                                disabled={deleteCar.isPending}
                            >
                                {deleteCar.isPending ? "Deleting..." : "Deleted"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsUpdating(true)}
                                className="rounded-lg bg-sky-600 px-4 py-2 text-white"
                            >
                                แก้ไข
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}

function toCarCreate(car: Car): CarCreate {
    return {
        licensePlate: car.licensePlate,
        province: car.province,
        brand: car.brand,
        model: car.model,
        year: car.year,
        color: car.color,
        remark: car.remark
    }
}