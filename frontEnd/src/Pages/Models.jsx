import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import CarCard from "../components/CarCard";
import Filter from "../components/Filter";

import CarImg1 from "../images/cars-big/audi-box.png";
import CarImg2 from "../images/cars-big/golf6-box.png";
import CarImg3 from "../images/cars-big/toyota-box.png";
import CarImg4 from "../images/cars-big/bmw-box.png";
import CarImg5 from "../images/cars-big/benz-box.png";
import CarImg6 from "../images/cars-big/passat-box.png";
import React, { useState, useEffect } from "react";

const mockCarData = [
  { id: 1, name: "Audi A1", price: 45, make: "Audi", doors: "4/5", transmission: "Manual", fuel: "Diesel", img: CarImg1 },
  { id: 2, name: "VW Golf 6", price: 37, make: "VW", doors: "4/5", transmission: "Manual", fuel: "Diesel", img: CarImg2 },
  { id: 3, name: "Toyota Camry", price: 30, make: "Camry", doors: "4/5", transmission: "Manual", fuel: "Diesel", img: CarImg3 },
  { id: 4, name: "BMW 320", price: 35, make: "ModernLine", doors: "4/5", transmission: "Manual", fuel: "Diesel", img: CarImg4 },
  { id: 5, name: "Mercedes Benz GLK", price: 50, make: "Benz GLK", doors: "4/5", transmission: "Manual", fuel: "Diesel", img: CarImg5 },
  { id: 6, name: "VW Passat CC", price: 25, make: "CC", doors: "4/5", transmission: "Manual", fuel: "Diesel", img: CarImg6 },
];

export default function Models() {
  const [carModels, setCarModels] = useState([]);
  const [filters, setFilters] = useState({ name: "", minPrice: "", maxPrice: "", date: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = () => {
      setTimeout(() => {
        setCarModels(mockCarData);
        setLoading(false);
      }, 500);
    };

    fetchModels();
  }, []);

  const filteredModels = carModels.filter((car) => {
    const matchesName = car.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesMinPrice = filters.minPrice ? car.price >= Number(filters.minPrice) : true;
    const matchesMaxPrice = filters.maxPrice ? car.price <= Number(filters.maxPrice) : true;
    const matchesDate = filters.date ? car.date === filters.date : true;

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
