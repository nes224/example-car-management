import type { ReactNode } from "react"

type Props = {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
}

export default function Modal({ open, title, onClose, children }: Props) {

    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-2xl rounded-xl bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400">
                        x
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}