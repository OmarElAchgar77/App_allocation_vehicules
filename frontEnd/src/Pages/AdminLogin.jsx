import React, { useState } from 'react';
import {apiClient, apiAdmin} from '../api/api';
import './AdminPage.css';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { PRIMARY_COLOR, WHITE, LIGHT_GRAY } from '../theme';
import { ToastContainer, toast } from 'react-toastify';

const LOGIN_ENDPOINT = '/login';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await apiClient.post("/login", {
                email,
                password,
            });

            if (response.data && response.data.token) {
                const { token, user } = response.data;
                if(user.role != "admin") {
                    toast.error('Login successful, but Not Admin');
                }else{
                    localStorage.setItem('adminToken', token);
                    toast.success('Login successful! Redirecting to dashboard...');
                    navigate("/admin/home");
                }
            } else {
                toast.error('Login successful, but server response was incomplete.');
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || 'Invalid email or password.';
                toast.error(`Login failed: ${errorMessage}`);
            } else if (error.request) {
                toast.error('Network Error: No response received from the server.');
            } else {
                toast.error('An unexpected error occurred during login setup.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
          <ToastContainer />
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
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: `1px solid ${LIGHT_GRAY}`, 
                                borderRadius: '8px', 
                                outline: 'none',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: `1px solid ${LIGHT_GRAY}`, 
                                borderRadius: '8px',
                                outline: 'none',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: loading ? LIGHT_GRAY : PRIMARY_COLOR,
                            color: loading ? '#6B7280' : WHITE,
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1.1em',
                            fontWeight: '600',
                            transition: 'background-color 0.3s',
                            boxShadow: loading ? 'none' : `0 4px 6px rgba(0, 0, 0, 0.1)`,
                        }}
                    >
                        {loading ? 'Logging In...' : 'Secure Login'}
                    </button>
                </form>
                {message && (
                    <p style={{ 
                        marginTop: '20px', 
                        textAlign: 'center', 
                        padding: '10px',
                        backgroundColor: message.includes('successful') ? '#D1FAE5' : '#FEE2E2',
                        color: message.includes('successful') ? '#059669' : '#DC2626',
                        borderRadius: '6px',
                        fontWeight: '500',
                        border: `1px solid ${message.includes('successful') ? '#A7F3D0' : '#FCA5A5'}`,
                    }}>
                        {message}
                    </p>
                )}
            </div>
        </Layout>
    );
};

export default AdminLogin;