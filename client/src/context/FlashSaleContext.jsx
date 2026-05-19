import { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const FlashSaleContext = createContext(null);

export const FlashSaleProvider = ({ children }) => {
  const [flashSale, setFlashSale] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFlashSale = async () => {
    try {
      const res = await fetch(`${API_URL}/api/flash-sale`);
      const data = await res.json();
      setFlashSale(data);
    } catch (err) {
      console.error("Failed to fetch flash sale:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSale();
  }, []);

  const isSaleActive = () => {
    if (!flashSale?.isActive) return false;
    if (flashSale.endsAt && new Date(flashSale.endsAt) < new Date()) return false;
    return true;
  };

  // Returns discount % for a product (product rule > category rule > all rule)
  const getDiscount = (product) => {
    if (!isSaleActive() || !flashSale?.rules?.length) return 0;
    const productRule = flashSale.rules.find(
      (r) => r.type === "product" && r.target === product._id
    );
    if (productRule) return productRule.discount;
    const categoryRule = flashSale.rules.find(
      (r) => r.type === "category" && r.target === product.category
    );
    if (categoryRule) return categoryRule.discount;
    const allRule = flashSale.rules.find((r) => r.type === "all");
    if (allRule) return allRule.discount;
    return 0;
  };

  const getSalePrice = (product) => {
    const discount = getDiscount(product);
    if (!discount) return null;
    return Math.round(product.price * (1 - discount / 100));
  };

  const getMaxDiscount = () => {
    if (!isSaleActive() || !flashSale?.rules?.length) return 0;
    return Math.max(...flashSale.rules.map((r) => r.discount));
  };

  return (
    <FlashSaleContext.Provider
      value={{ flashSale, setFlashSale, loading, isSaleActive, getDiscount, getSalePrice, getMaxDiscount, refetch: fetchFlashSale }}
    >
      {children}
    </FlashSaleContext.Provider>
  );
};

export const useFlashSale = () => useContext(FlashSaleContext);
