import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // make sure toast styles load
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/Cart-context.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // ⬅️ new

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <ToastContainer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
