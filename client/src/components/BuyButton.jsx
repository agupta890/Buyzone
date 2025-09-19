import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";

const BuyButton = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product,1); // ✅ Add with qty=1
    navigate("/cart"); // ✅ Redirect to checkout
  };

  return (
    <button
      onClick={handleBuyNow}
      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-2xl transition"
    >
      BUY NOW
    </button>
  );
};

export default BuyButton;
