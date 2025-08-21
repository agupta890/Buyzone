import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import './index.css'
import App from './App.jsx'
import {CartProvider} from './context/Cart-context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
       <BrowserRouter>
    <App />
     <ToastContainer />
    </BrowserRouter>
    </CartProvider>
   
    
  </StrictMode>,
)
