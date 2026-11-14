import { Navigate, Route, Routes } from 'react-router-dom'
import AllTasks from './pages/AllTasks.jsx'
import Home from './pages/Home.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Search from './pages/Search.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/tasks" element={<AllTasks />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
