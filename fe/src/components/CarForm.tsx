import { useState } from "react"
import type { CarCreate } from "../types/car"

type CarFormState = Omit<CarCreate, "year"> & { year: string }

const createCarForm: CarFormState = {
    licensePlate: "",
    province: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    remark: null,
}

type Props = {
    initial?: CarCreate
    onSubmit: (input: CarCreate) => void
}

const inputClass = "w-full rounded-lg border border-gray-200 px-3 py-1"

export default function CarForm({ initial, onSubmit }: Props) {
    const [form, setForm] = useState<CarFormState>(
        initial ? { ...initial, year: String(initial.year)} : createCarForm
    )
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ ...form, year: Number(form.year) })
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <label className="space-y-1">
                <span className="text-sm text-sky-900">ทะเบียน</span>
                <input
                    className={inputClass}
                    value={form.licensePlate}
                    required
                    onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                />
            </label>
            <label className="space-y-1">
                <span className="text-sm text-sky-900">จังหวัด</span>
                <input
                    className={inputClass}
                    value={form.province}
                    required
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                />
            </label>
            <label className="space-y-1">
                <span className="text-sm text-sky-900">ยี่ห้อ</span>
                <input
                    className={inputClass}
                    value={form.brand}
                    required
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
            </label>
            <label className="space-y-1">
                <span className="text-sm text-sky-900">รุ่น</span>
                <input
                    className={inputClass}
                    value={form.model}
                    required
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
            </label>
            <label className="space-y-1">
                <span className="text-sm text-sky-900">ปี</span>
                <input
                    className={inputClass}
                    inputMode="numeric"
                    value={form.year}
                    maxLength={4}
                    required
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
            </label>
            <label className="space-y-1">
                <span className="text-sm text-sky-900">สี</span>
                <input
                    className={inputClass}
                    value={form.color}
                    required
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
            </label>
            <label className="space-y-1">
                <span className="text-sm text-sky-900">หมายเหตุ</span>
                <input
                    className={inputClass}
                    value={form.remark ?? ""}
                    onChange={(e) => setForm({ ...form, remark: e.target.value || null })}
                />
            </label>

            <div className="col-span-2 flex justify-end">
                <button className="rounded-lg bg-sky-600 px-4 py-2 text-black">
                    Save
                </button>
            </div>

        </form>
    )
}