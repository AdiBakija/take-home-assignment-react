import { Routes, Route } from 'react-router-dom'
import Login from './routes/Login'
import Home from './routes/Home'
import './App.css'

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                {/* <Route path="/products" element={<Products />} /> */}
            </Routes>
        </>
    )
}

export default App
