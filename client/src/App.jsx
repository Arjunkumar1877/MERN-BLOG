import React from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import Projects from './pages/Projects'
import SignUp from './pages/SignUp'

function App() {
  return (
<BrowserRouter>
   <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/about' element={<About />} />
    <Route path='/sign-in' element={<SignIn />} />
    <Route path='/sign-up' element={<SignUp />} />
    <Route path='/dashbord' element={<Dashboard />} />
    <Route path='/projects' element={<Projects />} />
   </Routes>
</BrowserRouter>  )
}

export default App