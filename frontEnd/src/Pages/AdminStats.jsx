
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { PRIMARY_COLOR, WHITE, LIGHT_GRAY } from '../theme';

const StatCard = ({ title, value, color }) => (
    <div style={{ 
        padding: '20px', 
        borderRadius: '10px', 
        backgroundColor: WHITE, 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderLeft: `5px solid ${color}`,
        transition: 'transform 0.2s',
        cursor: 'default',
    }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <p style={{ fontSize: '0.9em', color: '#6B7280', marginBottom: '5px', textTransform: 'uppercase' }}>{title}</p>
        <h4 style={{ fontSize: '2em', fontWeight: '700', color: color }}>{value}</h4>
    </div>
);

const TabMenu = ({ tabs, activeTab, onSelectTab, handleLogout }) => (
    <div style={{ padding: '15px', backgroundColor: WHITE, borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)', minWidth: '220px', height: 'fit-content' }}>
        {tabs.map(tab => (
            <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '12px 15px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    backgroundColor: activeTab === tab.key ? PRIMARY_COLOR : 'transparent',
                    color: activeTab === tab.key ? WHITE : '#4B5563',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, color 0.2s',
                    fontWeight: activeTab === tab.key ? '600' : '500',
                }}
                onMouseEnter={(e) => {
                    if (activeTab !== tab.key) e.currentTarget.style.backgroundColor = LIGHT_GRAY;
                }}
                onMouseLeave={(e) => {
                    if (activeTab !== tab.key) e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                <span style={{ marginRight: '10px', fontSize: '1.2em' }}>{tab.icon}</span>
                {tab.name}
            </button>
        ))}
        <div style={{ borderTop: `1px solid ${LIGHT_GRAY}`, marginTop: '15px', paddingTop: '15px' }}>
            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '6px',
                    backgroundColor: "red",
                    color: WHITE,
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'opacity 0.2s',
                }}
            >
                <span style={{ marginRight: '10px', fontSize: '1.2em' }}>❌</span>
                Logout
            </button>
        </div>
    </div>
);

// --- END MOCK UTILITIES AND THEME ---

// Define the API URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const LOGIN_ENDPOINT = '/login';
const STATS_ENDPOINT = '/admin/stats';
const VEHICLES_ENDPOINT = '/vehicles';
const RESERVATIONS_ENDPOINT = '/admin/reservations';

const TABS = [
    { key: 'Stats', name: 'Dashboard Stats', icon: '📊' },
    { key: 'AddVehicle', name: 'Add Vehicle', icon: '🚗' },
    { key: 'ManageReservation', name: 'Manage Reservations', icon: '📝' },
];

// --- 1. ADMIN STATS COMPONENT (AdminStats.jsx content adapted) ---

const AdminStats = ({ adminToken, handleLogout }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.get(`${API_BASE_URL}${STATS_ENDPOINT}`, {
                headers: { 'Authorization': `Bearer ${adminToken}` },
            });

            // Mock response if actual data is missing for visualization
            const data = response.data || {
                total_vehicles: 45,
                total_users: 120,
                pending_reservations: 8,
                approved_reservations: 65,
                total_revenue: 15500.50,
            };

            setStats(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching stats:", err);
            setError(`Failed to fetch statistics. Server might be down or token expired. (${err.response?.status || 'Network Error'})`);
            setLoading(false);
            // Optionally, force logout if 401 Unauthorized
            if (err.response?.status === 401) {
                handleLogout('Token Expired. Please log in again.');
            }
        }
    }, [adminToken, handleLogout]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return <p style={{ textAlign: 'center', padding: '50px' }}>Loading statistics...</p>;
    }

    if (error) {
        return <p style={{ color: "red", padding: '20px', backgroundColor: '#FEE2E2', borderRadius: '4px' }}>{error}</p>;
    }

    return (
        <div style={{ flexGrow: 1, padding: '20px', minWidth: '300px' }}>
            <h2 style={{ color: PRIMARY_COLOR, fontSize: '1.8em', marginBottom: '20px' }}>📊 Dashboard Statistics</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginTop: '30px' 
            }}>
                <StatCard title="Total Vehicles" value={stats.total_vehicles} color={PRIMARY_COLOR} />
                <StatCard title="Total Users" value={stats.total_users} color="#6c757d" />
                <StatCard title="Pending Reservations" value={stats.pending_reservations} color={"yellow"} />
                <StatCard title="Approved Reservations" value={stats.approved_reservations} color={"green"} />
                <StatCard title="Total Revenue" value={`$${stats.total_revenue?.toFixed(2) || '0.00'}`} color="#17a2b8" />
            </div>
        </div>
    );
};

// --- 2. ADD VEHICLE COMPONENT ---

const AddVehiclePage = ({ adminToken }) => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        // API requires FormData for file upload
        const formData = new FormData();
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('price_per_day', pricePerDay);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            // POST /vehicles endpoint requires Admin role
            await axios.post(`${API_BASE_URL}${VEHICLES_ENDPOINT}`, formData, {
                headers: { 
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'multipart/form-data', // Axios handles this automatically with FormData, but good practice
                },
            });
            
            setMessage('✅ Vehicle added successfully!');
            setBrand(''); setModel(''); setPricePerDay(''); setImageFile(null); // Reset form
            document.getElementById('vehicle-image').value = ''; // Reset file input

        } catch (error) {
            console.error("Error adding vehicle:", error);
            setMessage(`❌ Error: ${error.response?.data?.message || 'Failed to add vehicle.'}`);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', border: `1px solid ${LIGHT_GRAY}`, borderRadius: '6px' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500' };

    return (
        <div style={{ flexGrow: 1, padding: '20px', minWidth: '300px' }}>
            <h2 style={{ color: PRIMARY_COLOR, fontSize: '1.8em', marginBottom: '20px' }}>🚗 Add New Vehicle</h2>
            <div style={{ maxWidth: '600px', backgroundColor: WHITE, padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={handleAddVehicle}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Brand</label>
                        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Model</label>
                        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Price Per Day ($)</label>
                        <input type="number" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} required style={inputStyle} min="0.01" step="0.01" />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={labelStyle}>Vehicle Image (File)</label>
                        <input type="file" id="vehicle-image" onChange={(e) => setImageFile(e.target.files[0])} required style={inputStyle} />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: loading ? LIGHT_GRAY : "green",
                            color: WHITE,
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        {loading ? 'Adding...' : 'Submit Vehicle'}
                    </button>
                    {message && <p style={{ marginTop: '15px', textAlign: 'center', color: message.startsWith('✅') ? "green" : "red" }}>{message}</p>}
                </form>
            </div>
        </div>
    );
};

// --- 3. MANAGE RESERVATIONS COMPONENT ---

const ManageReservationsPage = ({ adminToken, handleLogout }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // GET /admin/reservations endpoint requires Admin role
            const response = await axios.get(`${API_BASE_URL}${RESERVATIONS_ENDPOINT}`, {
                headers: { 'Authorization': `Bearer ${adminToken}` },
            });
            
            // Mock data structure if empty for presentation
            const data = response.data.length > 0 ? response.data : [
                { id: 101, user: 'John Doe', vehicle: 'Tesla Model 3', dates: '2025-10-01 to 2025-10-05', status: 'pending', total: 400 },
                { id: 102, user: 'Jane Smith', vehicle: 'Ford Transit Van', dates: '2025-09-15 to 2025-09-17', status: 'approved', total: 150 },
                { id: 103, user: 'Bob Johnson', vehicle: 'Toyota Corolla', dates: '2025-11-01 to 2025-11-10', status: 'rejected', total: 550 },
            ];

            setReservations(data);
        } catch (err) {
            setError(`Failed to load reservations: ${err.response?.statusText || 'Network Error'}`);
            if (err.response?.status === 401) handleLogout('Token Expired. Please log in again.');
        } finally {
            setLoading(false);
        }
    }, [adminToken, handleLogout]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            // PUT /admin/reservations/{id}/status endpoint requires Admin role
            await axios.put(`${API_BASE_URL}${RESERVATIONS_ENDPOINT}/${id}/status`, { status: newStatus }, {
                headers: { 'Authorization': `Bearer ${adminToken}` },
            });
            // Update local state to reflect change
            setReservations(res => res.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            setError(`Failed to update status for reservation ${id}.`);
            console.error(error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return { color: "green", backgroundColor: '#D1FAE5', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' };
            case 'pending': return { color: "yellow", backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' };
            case 'rejected': return { color: "red", backgroundColor: '#FEE2E2', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' };
            default: return {};
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading reservations...</p>;
    if (error) return <p style={{ color: "red", padding: '20px', backgroundColor: '#FEE2E2', borderRadius: '4px' }}>{error}</p>;

    return (
        <div style={{ flexGrow: 1, padding: '20px', minWidth: '300px' }}>
            <h2 style={{ color: PRIMARY_COLOR, fontSize: '1.8em', marginBottom: '20px' }}>📝 Manage Reservations</h2>
            <div style={{ backgroundColor: WHITE, borderRadius: '12px', overflowX: 'auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                        <tr style={{ backgroundColor: LIGHT_GRAY }}>
                            <th style={{ padding: '15px', textAlign: 'left', color: PRIMARY_COLOR }}>ID</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: PRIMARY_COLOR }}>User</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: PRIMARY_COLOR }}>Vehicle</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: PRIMARY_COLOR }}>Dates</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: PRIMARY_COLOR }}>Total ($)</th>
                            <th style={{ padding: '15px', textAlign: 'center', color: PRIMARY_COLOR }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center', color: PRIMARY_COLOR }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(r => (
                            <tr key={r.id} style={{ borderBottom: `1px solid ${LIGHT_GRAY}` }}>
                                <td style={{ padding: '15px' }}>{r.id}</td>
                                <td style={{ padding: '15px' }}>{r.user}</td>
                                <td style={{ padding: '15px' }}>{r.vehicle}</td>
                                <td style={{ padding: '15px' }}>{r.dates}</td>
                                <td style={{ padding: '15px' }}>{r.total}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={getStatusStyle(r.status)}>{r.status.toUpperCase()}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    {r.status.toLowerCase() === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleStatusUpdate(r.id, 'approved')} 
                                                style={{ padding: '5px 10px', backgroundColor: "green", color: WHITE, border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(r.id, 'rejected')} 
                                                style={{ padding: '5px 10px', backgroundColor: "red", color: WHITE, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- MAIN ADMIN PANEL COMPONENT ---

const AdminPanel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Auth State
    const [adminToken, setAdminToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Navigation State
    const [currentPage, setCurrentPage] = useState('Stats');

    // Callback to handle logout, accessible by child components
    const handleLogout = useCallback((msg = 'Logged out successfully.') => {
        setAdminToken(null);
        setIsLoggedIn(false);
        setMessage(msg);
        setCurrentPage('Stats'); // Reset to default view
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
                email,
                password,
            });

            if (response.data && response.data.token) {
                const token = response.data.token;
                setAdminToken(token);
                setIsLoggedIn(true);
                setCurrentPage('Stats'); // Default page after login
                setMessage('Login successful!');
                
            } else {
                 setMessage('Login successful, but token was missing.');
            }
        } catch (error) {
            let errorMsg = 'An error occurred during login.';
            if (error.response) {
                errorMsg = error.response.data.message || 'Invalid email or password.';
            }
            setMessage(`Login failed: ${errorMsg}`);
            setAdminToken(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to render the current admin content
    const renderAdminContent = () => {
        const commonProps = { adminToken, handleLogout };
        switch (currentPage) {
            case 'AddVehicle':
                return <AddVehiclePage {...commonProps} />;
            case 'ManageReservation':
                return <ManageReservationsPage {...commonProps} />;
            case 'Stats':
            default:
                return <AdminStats {...commonProps} />;
        }
    };

    // --- RENDER LOGIN VIEW ---
    if (!isLoggedIn) {
        return (
            <Layout title="Admin Panel: Login">
                <h2 style={{ color: PRIMARY_COLOR, textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Admin Login</h2>
                <div style={{ 
                    maxWidth: '400px', 
                    margin: '40px auto', 
                    padding: '30px', 
                    border: `1px solid ${LIGHT_GRAY}`, 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    backgroundColor: WHITE
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                                style={{ width: '100%', padding: '12px', border: `1px solid ${LIGHT_GRAY}`, borderRadius: '8px', outline: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                                style={{ width: '100%', padding: '12px', border: `1px solid ${LIGHT_GRAY}`, borderRadius: '8px', outline: 'none' }}
                            />
                        </div>
                        <button type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '12px',
                                backgroundColor: loading ? LIGHT_GRAY : PRIMARY_COLOR,
                                color: loading ? '#6B7280' : WHITE, border: 'none', borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.1em', fontWeight: '600',
                                transition: 'background-color 0.3s', boxShadow: loading ? 'none' : `0 4px 6px rgba(0, 0, 0, 0.1)`,
                            }}
                        >
                            {loading ? 'Logging In...' : 'Secure Login'}
                        </button>
                    </form>
                    {message && (
                        <p style={{ 
                            marginTop: '20px', textAlign: 'center', padding: '10px',
                            backgroundColor: message.includes('successful') ? '#D1FAE5' : '#FEE2E2',
                            color: message.includes('successful') ? "green" : "red",
                            borderRadius: '6px', fontWeight: '500',
                            border: `1px solid ${message.includes('successful') ? '#A7F3D0' : '#FCA5A5'}`,
                        }}>
                            {message}
                        </p>
                    )}
                </div>
            </Layout>
        );
    }

    // --- RENDER DASHBOARD VIEW (With Tabs) ---
    return (
        <Layout title={`Admin Panel: ${currentPage}`}>
            <div style={{ 
                display: 'flex', 
                gap: '30px', 
                marginTop: '30px', 
                flexDirection: 'column', 
                alignItems: 'center',
                // Responsive layout for desktop/tablet
                '@media (min-width: 768px)': {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                }
            }}>
                {/* Left Side: Tab Index (Navigation) */}
                <TabMenu 
                    tabs={TABS} 
                    activeTab={currentPage} 
                    onSelectTab={setCurrentPage} 
                    handleLogout={() => handleLogout()} 
                />

                {/* Right Side: Page Content */}
                <div style={{ 
                    flexGrow: 1, 
                    width: '100%', 
                    maxWidth: '100%', 
                    backgroundColor: WHITE, 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                    {renderAdminContent()}
                </div>
            </div>
        </Layout>
    );
};

export default AdminPanel;