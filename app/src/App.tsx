import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home'
import Login from './routes/Login'
import Products from './routes/Products'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        </Routes>
    )
}

export default App
