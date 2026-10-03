import { BrowserRouter, Route, Routes } from 'react-router'
import { HomePage } from './pages/HomePage'
import { CreatePage } from './pages/CreatePage'
import { AdvertisementPage } from './pages/AdvertisementPage'

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-50">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/annons/:id" element={<AdvertisementPage />} />
                    <Route path="/ny" element={<CreatePage />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}