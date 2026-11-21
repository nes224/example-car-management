import React, { useState } from "react"
import DataTable, { type Column } from "../components/DataTable"
import Modal from "../components/Modal"
import type { Car } from "../types/car"
import CarForm from "../components/CarForm"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { carsApi } from "../api/cars"
import { useDebounce } from "../hook/useDebounce"

let PAGE_SIZE: number = 20;
type Filters = {
    keyword: string
    province: string
    brand: string
    orderBy: "asc" | "desc"
}
const emptyFilters: Filters = {
    keyword: "",
    province: "",
    brand: "",
    orderBy: "desc",
}


const columns: Column<Car>[] = [
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
                <CarForm onSubmit={(input) => createCar.mutate(input)} />
            </Modal>
        </div>
    )
}