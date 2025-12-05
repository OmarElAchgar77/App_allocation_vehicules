import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import CarCard from "../components/CarCard";
import Filter from "../components/Filter";

import React, { useState, useEffect } from "react";
import {apiClient, apiAdmin} from '../api/api';

export default function Models() {
  const [carModels, setCarModels] = useState([]);
  const [filters, setFilters] = useState({ name: "", minPrice: "", maxPrice: "", date: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      // 1. Set loading state to true (already done by initial state)
      setLoading(true);

      try {
        // 2. Await the successful API call to get the response object
        const response = await apiClient.get('/vehicles');
        console.log(response.data);
        
        // 3. Set carModels state to the actual data array from the response
        // This is the crucial fix: you must wait for the data before setting the state.
        if (Array.isArray(response.data)) {
          setCarModels(response.data);
        } else {
          // Handle case where API response.data might not be an array
          console.error("API did not return an array:", response.data);
          setCarModels([]); 
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally show an error message to the user here
        setCarModels([]); // Ensure it remains an array on error
      } finally {
        // 4. Set loading state to false
        setLoading(false);
      }
    };

    fetchModels();
  }, []); // Empty dependency array ensures this runs only once on component mount

  const filteredModels = carModels.filter((car) => {
    // Ensure car and necessary properties exist before trying to access them
    if (!car || !car.brand || car.price_per_day === undefined) return false;

    const matchesName = car.brand.toLowerCase().includes(filters.name.toLowerCase());
    const matchesMinPrice = filters.minPrice ? car.price_per_day >= Number(filters.minPrice) : true;
    const matchesMaxPrice = filters.maxPrice ? car.price_per_day <= Number(filters.maxPrice) : true;
    // Note: Comparing full timestamps/dates with '===' might be too strict. 
    // You might need to adjust the date comparison logic based on how dates are stored in your API.
    const matchesDate = filters.date ? car.created_at.includes(filters.date) : true;

    return matchesName && matchesMinPrice && matchesMaxPrice && matchesDate;
  });


  const modelsDivStyle = {
    display: "grid",
    justifyItems: "center",
    justifyContent: "center",
    gap: "2rem",
    padding: "3rem 0",
    maxWidth: "1600px",
    margin: "0 auto",
    width: "100%",
    gridTemplateColumns: "repeat(4, 420px)",
  };

  return (
    <>
      <section className="models-section" id="models-page-container">
        <HeroPages name="Vehicle Models" child={<Filter filters={filters} setFilters={setFilters} />}/>
        
         <div id="models-grid" style={modelsDivStyle}>
          {loading ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", fontSize: "2rem" }}>
              Loading models...
            </p>
          ) : filteredModels.length > 0 ? (
            filteredModels.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", fontSize: "1.5rem" }}>
              No cars found.
            </p>
          )}
        </div>

        <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Réservez une voiture en nous contactant.</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3>(212) 456-7869</h3>
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}
