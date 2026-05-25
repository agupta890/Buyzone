import React, { createContext, useContext, useEffect, useState } from "react";
import { categories as staticCategories } from "../data/categories";

const API_URL = import.meta.env.VITE_API_URL;

const CategoriesContext = createContext([]);

// Convert API array → object keyed by slug (same shape as the static file)
const arrayToObj = (arr) =>
  arr.reduce((acc, cat) => {
    acc[cat.slug] = cat;
    return acc;
  }, {});

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState(staticCategories);
  const [catArray, setCatArray] = useState(Object.entries(staticCategories).map(([slug, c]) => ({ slug, ...c })));

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with static data to prioritize local image/config changes
          const mergedData = data.map(cat => ({
            ...cat,
            // If the static file has an image for this slug, use it
            image: staticCategories[cat.slug]?.image || cat.image
          }));
          setCategories(arrayToObj(mergedData));
          setCatArray(mergedData);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, catArray, setCategories, setCatArray }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
