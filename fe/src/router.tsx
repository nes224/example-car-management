import { createBrowserRouter, Navigate} from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import CarsPage from './pages/CarsPage'

export const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/cars" replace/>},
    {
        element: <AppLayout />,
        children: [
            { path: '/cars', element: <CarsPage />},
        ]
    }
])