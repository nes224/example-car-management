import { NavLink, Outlet } from "react-router-dom"


export default function AppLayout() {
    return (
        <div className="grid h-screen min-w-1024px grid-cols-[240px_1fr] grid-rows-[56px_1fr] overflow-hidden">
            <aside className="row-span-2 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
                <nav className="flex flex-col gap-1">
                    <NavLink to="/cars">Cars</NavLink>
                </nav>
            </aside>
            <header className="flex items-center border-b border-gray-200 px-6 font-semibold">
                Header
            </header>
            <main className="min-h-0 overflow-y-auto p-6">
                <div className="max-w-1400px">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}