import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CreatePage } from './pages/CreatePage'
import { AdvertisementPage } from './pages/AdvertisementPage'

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/ny" element={<CreatePage />} />
                    <Route path="/annons/:id" element={<AdvertisementPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}