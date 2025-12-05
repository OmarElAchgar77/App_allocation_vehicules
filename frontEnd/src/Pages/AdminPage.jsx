// AdminPage.jsx
import React, { useState, useEffect } from 'react';
import {apiClient, apiAdmin} from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import ReactDOM from 'react-dom';
import './AdminPage.css'; 

function ManageCars() {
    const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the Add/Edit form
  const [carData, setCarData] = useState({
    id: null, // Used for modification (PUT)
    brand: '',
    model: '',
    year: '',
    price_per_day: '',
    image: null,
  });
  const [carImage, setCarImage] = useState(null); 

  // --- Data Fetching ---
  const fetchVehicles = async () => {
    try {
      const response = await apiAdmin.get("/vehicles");
      setVehicles(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch vehicles.');
      setLoading(false);
      toast.error('Error fetching vehicles.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // --- Form Handlers ---
  const handleChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setCarImage(e.target.files[0]); 
  };
  
  const resetForm = () => {
    setCarData({
        id: null,
        brand: '',
        model: '',
        year: '',
        price_per_day: '',
        image: null,
    });
    setCarImage(null);
    // document.getElementById('car-image-upload').value = null; // Removed, unnecessary
    setIsModalOpen(false); // <--- This closes the modal
  };

  const handleAddClick = () => {
    // 1. Reset state data
    setCarData({
        id: null, // Crucial: sets ID to null for a POST request
        brand: '',
        model: '',
        year: '',
        price_per_day: '',
        image: null,
    });
    setCarImage(null);

    // 2. Open the modal
    setIsModalOpen(true);
    };
  

    const handleEditClick = (vehicle) => {
        setCarData({
            id: vehicle.id,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            price_per_day: vehicle.price_per_day,
            // vehicle.image is the correct full URL from the fixed API response
            image: vehicle.image, 
        });
        setCarImage(null); // IMPORTANT: Clear the file input so no accidental image upload happens
        setIsModalOpen(true);
    };

    // --- CRUD Operations ---
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isEditing = carData.id !== null;
    const endpoint = isEditing ? `/vehicles/${carData.id}` : "/vehicles";
    const method = apiAdmin.post;
    
    // Build FormData
    const formData = new FormData();
    formData.append('brand', carData.brand);
    formData.append('model', carData.model);
    formData.append('year', carData.year);
    formData.append('price_per_day', carData.price_per_day);
    
    // IMPORTANT for PUT: Laravel often requires _method=PUT/PATCH for file uploads
    if (isEditing) {
        formData.append('_method', 'PUT'); 
    }
    
    if (carImage) {
      formData.append('image', carImage);
    }

    try {
      await method(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success(`Car ${isEditing ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchVehicles(); // Refresh the list
      
    } catch (error) {
      const msg = error.response?.data?.message || 'Server error';
      toast.error(`Error: ${msg}`);
      console.error(error.response?.data?.errors || error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete car ID ${id}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await apiAdmin.delete(`/vehicles/${id}`);
      toast.success(`Car ID ${id} deleted successfully.`);
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete car.';
      toast.error(`Error deleting car: ${msg}`);
    }
  };

  
  const renderCarForm = () => (
    <form onSubmit={handleSubmit} className="add-car-form-grid">
      <h4 className="form-title">{carData.id ? '✏️ Edit Car Details' : '➕ Add New Car'}</h4>
      
      <input name="brand" value={carData.brand} onChange={handleChange} placeholder="Brand" required />
      <input name="model" value={carData.model} onChange={handleChange} placeholder="Model" required />
      <input name="year" value={carData.year} onChange={handleChange} placeholder="Year" type="number" required />
      <input name="price_per_day" value={carData.price_per_day} onChange={handleChange} placeholder="Price Per Day" type="number" required />

      <div className="file-input-wrapper">
        <label htmlFor="car-image-upload">
          {carData.id ? 'Replace Photo:' : 'Car Photo:'}
        </label>
        <br></br>
        <input 
            type="file" 
            id="car-image-upload" 
            name="image" 
            accept="image/*"
            onChange={handleImageChange} 
        />
        {(carData.image && carData.id) && (
            <small className="current-image-note">Current: <a href={carData.image} target="_blank" rel="noopener noreferrer">View Image</a></small>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className={`btn ${carData.id ? 'btn-update' : 'btn-add'}`}>
          {carData.id ? 'Save Changes' : 'Add Car'}
        </button>
        
        <button type="button" onClick={resetForm} className="btn btn-cancel">
          Cancel
        </button>
      </div>
    </form>
  );

  if (loading) return <p className="loading">Loading vehicle data...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="manage-cars-container">
      
      
      <div className="add-car-section">
        <button 
          onClick={handleAddClick}
          className="btn btn-primary"
        >
          ➕ Add New Vehicle
        </button>
        
        {isModalOpen && ReactDOM.createPortal(
            <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={resetForm}> 
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {renderCarForm()}
                        <button className="modal-close" onClick={resetForm}>&times;</button>
                    </div>
                </div>,
                document.body
        )}
      </div>

      
      <h3 className="section-title">🚗 Current Fleet ({vehicles.length})</h3>
      
      <table className="car-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Details</th>
            <th>Year</th>
            <th>Price/Day</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((car) => (
            <tr key={car.id}>
              <td>{car.id}</td>
              <td>
                {car.image && <img src={car.image} alt={`${car.brand} ${car.model}`} className="car-thumb" />}
              </td>
              <td>
                <strong>{car.brand} {car.model}</strong>
                <small style={{display: 'block', color: '#6c757d'}}>Available: {car.is_available ? 'Yes' : 'No'}</small>
              </td>
              <td>{car.year}</td>
              <td>${car.price_per_day}</td>
              <td className="action-cell">
                <button 
                  onClick={() => handleEditClick(car)} 
                  className="btn btn-action btn-edit"
                >
                  Modifie ✏️
                </button>
                <button 
                  onClick={() => handleDelete(car.id)} 
                  className="btn btn-action btn-delete"
                >
                  Delete 🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

function ListCarReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await apiAdmin.get("/admin/reservations");
        // Ensure reservation dates are parsed as local strings, not UTC
        const formattedReservations = response.data.map(res => ({
            ...res,
            start_date_local: new Date(res.start_date).toLocaleDateString(),
            end_date_local: new Date(res.end_date).toLocaleDateString(),
        }));

        setReservations(formattedReservations);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch reservations.';
        setError(errorMessage);
        setLoading(false);
        toast.error(`Error: ${errorMessage}`);
      }
    };

    fetchReservations();
  }, []);

  // --- Action Handler ---
  const handleAction = async (id, action) => {
    // action should be 'approve' or 'reject'
    const statusUpdate = action === 'approve' ? 'approved' : 'rejected';
    
    if (!window.confirm(`Are you sure you want to ${action} reservation ID ${id}?`)) {
        return;
    }

    try {
      await apiAdmin.put(`/admin/reservations/${id}/status`, { 
          status: statusUpdate 
      });

      // Update the local state upon success
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === id ? { ...res, status: statusUpdate } : res
        )
      );
      toast.success(`Reservation ${id} successfully ${statusUpdate}!`);

    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to ${action} reservation.`;
      toast.error(`Error: ${errorMessage}`);
      console.error(err);
    }
  };

  // --- Render Logic ---
  if (loading) return <p className="admin-loading">Loading reservations...</p>;
  if (error) return <p className="admin-error">Error: {error}</p>;

  return (
    <div className="admin-reservation-list">
      <h3 className="admin-list-title">📋 Pending & Current Reservations</h3>
      
      {reservations.length === 0 ? (
        <p className="no-reservations">No reservations found.</p>
      ) : (
        <table className="reservation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Period</th>
              <th>Total Price</th>
              <th>Status</th>
              <th className="action-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className={`status-${res.status}`}>
                <td>{res.id}</td>
                <td>
                  <div className="car-cell">
                    <img src={res.vehicle.image} alt={`${res.vehicle.brand} ${res.vehicle.model}`} className="car-image-thumb" />
                    <div>
                        <strong>{res.vehicle.brand} {res.vehicle.model}</strong>
                        <small>({res.vehicle.year})</small>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{res.user.name}</strong><br />
                  <small>{res.user.email}</small>
                  <a href={res.drivers_license} target="_blank" rel="noopener noreferrer" className="license-link">View License 💳</a>
                </td>
                <td>
                  {res.start_date_local} to {res.end_date_local}
                </td>
                <td>
                  <span className="total-price">{res.total_price} DH</span>
                </td>
                <td>
                  <span className={`status-badge status-${res.status}`}>{res.status.toUpperCase()}</span>
                </td>
                <td className="action-column">
                  {res.status === 'pending' ? (
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleAction(res.id, 'approve')} 
                        className="btn btn-approve"
                      >
                        Approve ✅
                      </button>
                      <button 
                        onClick={() => handleAction(res.id, 'reject')} 
                        className="btn btn-reject"
                      >
                        Reject ❌
                      </button>
                    </div>
                  ) : (
                    <span className={`status-text`}>
                        {res.status === 'approved' ? 'Approved' : res.status === 'rejected' ? 'Rejected' : 'Completed'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
///

function Status() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Inline CSS Styles ---
  const primaryColor = '#007bff';
  const successColor = '#28aa45'; // Adjusted green
  const warningColor = '#ffc107';
  const dangerColor = '#dc3545';
  const labelTextColor = '#343a40';
  const subtleGray = '#e9ecef';
  
  const headerStyle = {
    fontSize: '32px', // Very big header
    color: labelTextColor,
    marginBottom: '30px',
    paddingBottom: '10px',
    borderBottom: `2px solid ${primaryColor}40`,
    fontWeight: '700',
  };
  const barContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)', // Deeper shadow
  };
  const metricItemStyle = {
    marginBottom: '25px',
  };
  const labelStyle = {
    fontWeight: '700',
    fontSize: '20px', // Big label font
    color: labelTextColor,
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  };
  const barWrapperStyle = {
    height: '45px', // Taller bars
    backgroundColor: subtleGray,
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    border: `1px solid ${subtleGray}`,
  };
  
  // Bar styling utility function
  const getBarStyle = (width, color) => ({
    width: `${width}%`,
    height: '100%',
    backgroundColor: color,
    transition: 'width 0.8s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    minWidth: width > 0 ? '45px' : '0', // Ensures small bar shows color
    paddingLeft: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
  });

  // Text inside the bar
  const textInsideStyle = {
    color: 'white',
    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
  };

  // Text outside the bar (for small values)
  const textOutsideStyle = {
    position: 'absolute',
    top: '0',
    right: '15px', // Aligns to the right
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    color: labelTextColor,
    fontSize: '18px',
    fontWeight: 'bold',
  };
  
  // --- End of Styles ---


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiAdmin.get("/admin/stats");
        setStatus(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch system status.');
        setLoading(false);
        console.error('Error fetching status:', err);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <p>Loading system status...</p>;
  if (error) return <p style={{ color: dangerColor }}>Error: {error}</p>;
  if (!status) return <p>No status data available.</p>;


  // --- Logic for Bar Widths ---
  const totalReservations = status.active_reservations + status.pending_reservations;
  
  // Use a sensible scale for Vehicles and Users (e.g., max of vehicles, users, or 100)
  const maxScale = Math.max(status.total_vehicles, status.total_users, 100); 

  // Calculate widths
  const vehicleWidth = (status.total_vehicles / maxScale) * 100;
  const userWidth = (status.total_users / maxScale) * 100;

  // Reservations are relative to total reservations
  const activeResWidth = totalReservations > 0 ? (status.active_reservations / totalReservations) * 100 : 0;
  const pendingResWidth = totalReservations > 0 ? (status.pending_reservations / totalReservations) * 100 : 0;
  
  
  // Helper Component for Bar Rendering
  const Bar = ({ label, value, color, width, unit }) => {
    const textIsInside = width > 30; // Show text inside if bar is wide enough
    const valueText = `${value} ${unit}`;

    return (
        <div style={metricItemStyle}>
            <div style={labelStyle}>
                {label}:
            </div>
            
            <div style={barWrapperStyle}>
                <div 
                    style={getBarStyle(width, color)}
                >
                    
                    {textIsInside && <span style={textInsideStyle}>{valueText}</span>}
                </div>
                
                {!textIsInside && <span style={textOutsideStyle}>{valueText}</span>}
            </div>
        </div>
    );
  };
  // --- End of Logic ---


  return (
    <div>
      <h3 style={headerStyle}>📊 Fleet and Reservation Status</h3>
      <div style={barContainerStyle}>

        
        <Bar 
            label="Total Vehicles in Fleet" 
            value={status.total_vehicles} 
            color={primaryColor} 
            width={vehicleWidth} 
            unit="Vehicles" 
        />

        
        <Bar 
            label="Total Registered Users" 
            value={status.total_users} 
            color={successColor} 
            width={userWidth} 
            unit="Users" 
        />
        
        
        <Bar 
            label={`Active Reservations (Out of ${totalReservations} Total)`}
            value={status.active_reservations} 
            color={warningColor} 
            width={activeResWidth} 
            unit="Active" 
        />

        
        <Bar 
            label="Pending Reservations" 
            value={status.pending_reservations} 
            color={dangerColor} 
            width={pendingResWidth} 
            unit="Pending" 
        />
        
        
        <div style={{
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #dee2e6',
            fontSize: '22px',
            fontWeight: 'bold',
            color: labelTextColor,
            textAlign: 'center',
        }}>
            Total Reservations Handled: <span style={{ color: primaryColor }}>{totalReservations}</span>
        </div>
        
      </div>
    </div>
  );
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState('ManageCars');

  const renderContent = () => {
    switch (activeTab) {
      case 'ManageCars':
        return <ManageCars />;
      case 'listReservations':
        return <ListCarReservations />;
      case 'status':
        return <Status />;
      default:
        return <Status />;
    }
  };

  return (
    <div className="admin-page">
    <ToastContainer />
      <nav className="admin-nav">
        <button onClick={() => setActiveTab('status')} className={activeTab === 'status' ? 'active' : ''}>
          📊 Status
        </button>
        <button onClick={() => setActiveTab('listReservations')} className={activeTab === 'listReservations' ? 'active' : ''}>
          📋 List Car Reservations
        </button>
        <button onClick={() => setActiveTab('ManageCars')} className={activeTab === 'ManageCars' ? 'active' : ''}>
          ➕ Add Car
        </button>
      </nav>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage;