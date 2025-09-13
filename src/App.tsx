import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/auth/signup'
import Login from './pages/auth/login'
import Showcase from './pages/showcase/showcase'
import Dashboard from './pages/dash/dash'

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Showcase />} />
          <Route path='/dash' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
  
  )
}

export default App
