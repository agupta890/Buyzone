import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/Cart-context.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CategoriesProvider } from './context/CategoriesContext.jsx';
import { FlashSaleProvider } from './context/FlashSaleContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CategoriesProvider>
          <CartProvider>
            <FlashSaleProvider>
              <App />
            </FlashSaleProvider>
          </CartProvider>
        </CategoriesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
