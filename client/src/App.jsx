import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Bestseller } from "./pages/Prouducts-Pages/Bestseller";
import { Homedecor } from "./pages/Prouducts-Pages/Homedecor";
import { Handicraft } from "./pages/Prouducts-Pages/Handicraft";
import { Books } from "./pages/Prouducts-Pages/Books";
import { Pooja } from "./pages/Prouducts-Pages/Pooja";
import { Plants } from "./pages/Prouducts-Pages/Plants";
import { Cosmetic } from "./pages/Prouducts-Pages/Cosmetic";
import { Dryfruits } from "./pages/Prouducts-Pages/Dryfruits";
import { Toys } from "./pages/Prouducts-Pages/Toys";
import { Cart } from "./pages/Cart";
import { Wishlist } from "./pages/Wishlist";
import { MyOrders } from "./pages/Myorders";
import { Admin } from "./dashboard/Admin";


const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/bestseller" element={<Bestseller />} />
        <Route path="/homedecor" element={<Homedecor />} />
        <Route path="/books" element={<Books />} />
        <Route path="/handicraft" element={<Handicraft />} />
        <Route path="/pooja" element={<Pooja />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/cosmetic" element={<Cosmetic />} />
        <Route path="/dryfruits" element={<Dryfruits/>}/>
        <Route path="/toys" element={<Toys/>}/>

        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
