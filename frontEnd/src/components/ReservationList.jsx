
import React, { useState, useEffect } from 'react';
import './ReservationList.css';
import { BASE_STORAGE_URL, apiClient } from '../api/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    const generateInvoicePdf = (reservation) => {
        const invoiceContent = document.createElement('div');
        invoiceContent.className = 'invoice-template';
        
        const pickupDate = new Date(reservation.start_date).toLocaleDateString('fr-FR');
        const dropoffDate = new Date(reservation.end_date).toLocaleDateString('fr-FR');
        
        invoiceContent.innerHTML = `
            <style>
                .invoice-template { 
                    font-family: 'Helvetica Neue', Arial, sans-serif; 
                    padding: 30px; 
                    color: #333; 
                    font-size: 16px; 
                    /* Max-width is fine, but less relevant without the image flex layout */
                    max-width: 700px; 
                }
                .invoice-header { 
                    background-color: ${THEME_COLOR}; 
                    color: white; 
                    padding: 15px; 
                    text-align: center; 
                    border-radius: 5px; 
                    margin-bottom: 30px; /* Increased margin for spacing */
                }
                .invoice-header h2 {
                    font-size: 26px; 
                    margin: 0;
                }
                .invoice-header p {
                    font-size: 18px; 
                    margin: 5px 0 0 0;
                }
                
                /* Removed .vehicle-container, .vehicle-img, .detail-sections styles */

                .invoice-body { 
                    border: 1px solid #e0e0e0; 
                    padding: 20px; 
                    border-radius: 5px; 
                }
                .invoice-body h3 {
                    font-size: 22px; 
                    color: ${THEME_COLOR};
                    border-bottom: 2px solid #eee;
                    padding-bottom: 5px;
                    margin-top: 15px;
                    margin-bottom: 10px;
                    font-weight: 600;
                }
                .detail-row { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 8px 0; 
                    border-bottom: 1px dashed #f0f0f0; 
                    font-size: 18px; 
                }
                .detail-row span:first-child {
                    font-weight: bold;
                    color: #555;
                }
                .detail-row:last-child { border-bottom: none; }
                .total-line { 
                    font-weight: bold; 
                    font-size: 24px; 
                    color: red; 
                    margin-top: 25px; 
                    border-top: 3px double ${THEME_COLOR}; 
                    padding-top: 15px;
                    text-align: right; 
                }
            </style>
            
            <div class="invoice-header">
                <h2>Facture de Location #${reservation.id}</h2>
                <p>Statut: ${reservation.status.toUpperCase()} | Date d'émission: ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div class="invoice-body">
                
                <h3>Détails du Véhicule</h3>
                <div class="detail-row">
                    <span>Modèle:</span>
                    <span>${reservation.vehicle.brand} ${reservation.vehicle.model} (${reservation.vehicle.year})</span>
                </div>
                <div class="detail-row">
                    <span>Prix par jour:</span>
                    <span>${reservation.vehicle.price_per_day} DH</span>
                </div>
                <div class="detail-row">
                    <span>Statut de Réservation:</span>
                    <span>${reservation.status.toUpperCase()}</span>
                </div>


                <h3>Période de Location</h3>
                <div class="detail-row">
                    <span>Date de Ramassage:</span>
                    <span>${pickupDate}</span>
                </div>
                <div class="detail-row">
                    <span>Date de Retour:</span>
                    <span>${dropoffDate}</span>
                </div>
                
                <div class="total-line">
                    <span>Montant Total Payé:</span>
                    <span>${reservation.total_price} DH</span>
                </div>
            </div>
        `;

        // Append the content to the body 
        invoiceContent.style.position = 'absolute';
        invoiceContent.style.left = '-9999px';
        invoiceContent.style.top = '-9999px';
        document.body.appendChild(invoiceContent);

        html2canvas(invoiceContent, { scale: 3 }).then(canvas => { 
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); 
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight > pdfHeight ? pdfHeight : imgHeight);
            
            const filename = `Facture_Reservation_${reservation.id}.pdf`;
            pdf.save(filename); 

            document.body.removeChild(invoiceContent);
        });
    };

    if (loading) return <div className="loading">Loading reservations...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (reservations.length === 0) return <div className="no-reservations">No reservations found.</div>;

    return (
        <div className="reservation-list-container" style={{ '--theme-color': THEME_COLOR }}>
            <h2 className="list-title">Mes réservations</h2>
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
                                src={`${BASE_STORAGE_URL}${reservation.vehicle.image}`} 
                                alt={`${reservation.vehicle.brand} ${reservation.vehicle.model}`} 
                                className="vehicle-image"
                            />
                        )}
                        <div className="details">
                            
                            <p>
                                <span style={{ marginRight: '8px' }} role="img" aria-label="ID">#️⃣</span>
                                <strong>ID:</strong> {reservation.id}
                            </p>
                            
                            <p>
                                <span style={{ marginRight: '8px' }} role="img" aria-label="Dates">🗓️</span>
                                <strong>Period:</strong> {reservation.start_date} to {reservation.end_date}
                            </p>
                            
                            <p>
                                <span style={{ marginRight: '8px' }} role="img" aria-label="Price">💲</span>
                                <strong>Prix/Jour:</strong> {reservation.vehicle.price_per_day} DH
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

                        <div className="footer-content-wrapper">
                            <p className="total-price">
                                Total Price: {reservation.total_price} DH
                            </p>

                            <button 
                                className="download-button"
                                onClick={() => generateInvoicePdf(reservation)}
                                disabled={reservation.status.toUpperCase() !== 'APPROVED'}
                                style={{
                                    backgroundColor: reservation.status.toUpperCase() === 'APPROVED' ? THEME_COLOR : '#ccc',
                                    cursor: reservation.status.toUpperCase() === 'APPROVED' ? 'pointer' : 'not-allowed',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '5px',
                                    transition: 'background-color 0.3s',
                                    marginLeft: '20px', 
                                    opacity: reservation.status.toUpperCase() === 'APPROVED' ? 1 : 0.6,
                                }}
                            >
                                <i className="fa-solid fa-file-pdf"></i> Télécharger Facture
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReservationList;