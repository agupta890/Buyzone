import React from "react";
import { Routes, Route } from "react-router-dom";
import {Navbar} from './components/Navbar'
import {Footer} from './components/Footer'
import { HomePage } from "./pages/HomePage";
import { AllProduct } from "./pages/AllProduct";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

const App = () => {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<AllProduct />} />
      </Routes>
      <Footer/>
    </>
  );
};
export default App;
