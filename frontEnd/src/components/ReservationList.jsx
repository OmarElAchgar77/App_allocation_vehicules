import React, { useState, useEffect } from 'react';
import './ReservationList.css'; // Import the CSS file
import {apiAdmin, apiClient} from '../api/api'
const THEME_COLOR = "#29476d";

function ReservationList() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        const fetchReservations = async () => {
            try {
                const response = await apiClient.get("/my-reservations");
                const data = response.data;
                setReservations(data); 

            } catch (err) {
                const errorMessage = err.response 
                    ? `API Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`
                    : `Network Error: ${err.message}`;
                
                setError(errorMessage);
                console.error("Failed to fetch reservations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) return <div className="loading">Loading reservations...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (reservations.length === 0) return <div className="no-reservations">No reservations found.</div>;

    return (
        <div className="reservation-list-container" style={{ '--theme-color': THEME_COLOR }}>
            <h2 className="list-title">My Vehicle Reservations</h2>
            {reservations.map((reservation) => (
                <div key={reservation.id} className="reservation-card">
                    <div className="card-header">
                        <h3 className="vehicle-info">
                            {reservation.vehicle.brand} {reservation.vehicle.model} ({reservation.vehicle.year})
                        </h3>
                        <span className={`status-badge status-${reservation.status}`}>
                            {reservation.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="card-body">
                        {reservation.vehicle.image && (
                            <img 
                                src={reservation.vehicle.image} 
                                alt={`${reservation.vehicle.brand} ${reservation.vehicle.model}`} 
                                className="vehicle-image"
                            />
                        )}
                        <div className="details">
                            
                            <p>
                                <span style={{ marginRight: '8px' }} role="img" aria-label="ID">#️⃣</span>
                                <strong>Reservation ID:</strong> {reservation.id}
                            </p>
                            
                            
                            <p>
                                <span style={{ marginRight: '8px' }} role="img" aria-label="Dates">🗓️</span>
                                <strong>Period:</strong> {reservation.start_date} to {reservation.end_date}
                            </p>
                            
                            
                            <p>
                                <span style={{ marginRight: '8px' }} role="img" aria-label="Price">💲</span>
                                <strong>Price/Day:</strong> {reservation.vehicle.price_per_day} DH
                            </p>
                            
                            
                            {reservation.drivers_license && (
                                <p>
                                    <span style={{ marginRight: '8px' }} role="img" aria-label="License">💳</span>
                                    <strong>License:</strong> <a href={reservation.drivers_license} target="_blank" rel="noopener noreferrer" style={{ color: THEME_COLOR, textDecoration: 'none' }}>View File</a>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="card-footer">
                        <p className="total-price">
                            Total Price: {reservation.total_price} DH
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReservationList;