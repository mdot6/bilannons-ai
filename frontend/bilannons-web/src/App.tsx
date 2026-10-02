import { BrowserRouter, Route, Routes } from 'react-router'
import { HomePage } from './pages/HomePage'

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-50">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}