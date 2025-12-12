import React, { useState, useEffect } from "react";
import CarBox from "./CarBox"; 
import { apiClient } from '../api/api'; 

const formatCarData = (vehicle) => ({
    img: `${vehicle.image}`, 
    price: vehicle.price_per_day,
    model: vehicle.model,
    mark: vehicle.brand,
    year: vehicle.year,
    
    doors: '4/5', 
    air: vehicle.ac ? 'Oui' : (vehicle.air_conditioning ? 'Oui' : 'Non'), 
    transmission: vehicle.transmission || 'Automatique', 
    fuel: vehicle.fuel_type || 'Essence', 
});


function PickCar() {
    const [vehiclesList, setVehiclesList] = useState([]); 
    const [carBoxData, setCarBoxData] = useState({}); 
    
    const [selectedCarIndex, setSelectedCarIndex] = useState(0); 
    const [colorBtn, setColorBtn] = useState("btn0"); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await apiClient.get("/vehicles"); 
                
                const rawData = response.data.slice(0, 6);
                const formattedData = rawData.map(formatCarData);
                
                const tempCarBoxData = {};
                formattedData.forEach((car, index) => {
                    tempCarBoxData[index] = [car]; 
                });

                setVehiclesList(formattedData);
                setCarBoxData(tempCarBoxData);
                
            } catch (err) {
                console.error("Failed to fetch vehicles:", err);
                setError("Échec du chargement des données des véhicules.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []); 
    
    const handleCarSelect = (index) => {
        setSelectedCarIndex(index);
        setColorBtn(`btn${index}`); 
    };

    const coloringButton = (index) => {
        return colorBtn === `btn${index}` ? "colored-button" : "";
    };

    if (loading) return <div className="loading">Chargement des modèles...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (vehiclesList.length === 0) return <div className="no-cars">Aucun véhicule disponible à l'affichage.</div>;

    return (
        <section className="pick-section">
            <div className="container">
                <div className="pick-container">
                    <div className="pick-container__title">
                        <h3>Modèles de véhicules</h3>
                        <h2>Our rental fleet</h2>
                        <p>
                            Choisissez parmi notre gamme de véhicules exceptionnels à louer pour votre
                            prochaine aventure ou voyage d'affaires
                        </p>
                    </div>

                    <div 
                        className="pick-container__car-content"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            marginTop: '40px',
                            gap: '20px' 
                        }}
                    >
                        <div 
                            className="pick-box"
                            style={{
                                width: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                flexShrink: 0,
                            }}
                        >
                            {vehiclesList.map((car, index) => (
                                <button
                                    key={index}
                                    className={`${coloringButton(index)}`} 
                                    onClick={() => handleCarSelect(index)}
                                >
                                    {car.mark} {car.model}
                                </button>
                            ))}
                        </div>

                        {carBoxData[selectedCarIndex] && (
                            <div 
                                style={{ 
                                    width: '70%', 
                                    flexGrow: 1,
                                    textAlign: 'center',
                                }}
                            >
                                <CarBox 
                                    data={carBoxData} 
                                    carID={selectedCarIndex} 
                                />
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PickCar;