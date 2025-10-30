import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/home'
import Product from './pages/Product'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import AllProducts from './pages/AllProducts'
import  { Toaster } from 'react-hot-toast';
import CheckoutPage from './pages/CheckoutPage'
import Orders from './pages/Orders'
function App() {
  return (
   <>
   <Navbar />
   <Toaster 
        position="top-center" 
        reverseOrder={false} 
      />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/product/:id' element={<Product />} />
      <Route  path='/login' element={<Login />} />
      <Route path='/register' element={<Register/>} />
      <Route path='/cart' element={<Cart/>} />
       <Route path='/products' element={<AllProducts/>} />
       <Route path='/cheekout' element={<CheckoutPage />} />
      <Route path='/orders' element={<Orders />} />

    </Routes>
   </>
  )
}

export default App