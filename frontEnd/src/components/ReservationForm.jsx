
import { useState, useEffect } from 'react';
import { apiClient } from '../api/api';
import { toast } from 'react-toastify';


const theme = {
    primaryColor: '#007bff', 
    primaryDark: '#0056b3', 
    cardBackground: '#ffffff',
    textColor: '#333333',
    inputBorder: '#e0e0e0',
    inputBackground: '#f8f8f8',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
};

const formStyles = {
    formCard: {
        background: theme.cardBackground,
        padding: '35px', 
        borderRadius: '16px',
        boxShadow: theme.boxShadow,
        maxWidth: '480px', 
        width: '95%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px', 
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        fontSize: '1.8rem', 
        fontWeight: '800',
        color: theme.textColor,
        marginBottom: '5px',
    },
    detailContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: `1px solid ${theme.inputBorder}`,
    },
    detailLabel: {
        fontSize: '1.1rem', 
        fontWeight: '600',
        color: theme.textColor,
    },
    detailValue: {
        fontSize: '1.2rem', 
        fontWeight: '700',
        color: theme.primaryColor,
    },
    closeButton: {
        position: 'absolute',
        top: '18px',
        right: '18px',
        background: 'none',
        border: 'none',
        fontSize: '1.8rem', 
        cursor: 'pointer',
        color: theme.textColor,
        opacity: 0.7,
        transition: 'opacity 0.2s',
    },
    closeButtonHover: {
        opacity: 1,
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', 
    },
    label: {
        fontWeight: '600',
        fontSize: '1.05rem', 
        color: theme.textColor,
    },
    input: {
        padding: '14px', 
        borderRadius: '8px',
        border: `1px solid ${theme.inputBorder}`,
        backgroundColor: theme.inputBackground,
        fontSize: '1.1rem', 
        transition: 'border-color 0.3s, box-shadow 0.3s',
        outline: 'none',
    },
    inputFocus: {
        borderColor: theme.primaryColor,
        boxShadow: `0 0 0 4px rgba(0, 123, 255, 0.3)`, 
    },
    fileInputLabel: {
        padding: '15px', 
        borderRadius: '8px',
        border: `2px dashed ${theme.inputBorder}`,
        backgroundColor: theme.inputBackground,
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '1rem',
        color: theme.textColor,
        transition: 'border-color 0.3s, background-color 0.3s',
    },
    fileInputLabelHover: {
        borderColor: theme.primaryColor,
        backgroundColor: '#f0faff',
    },
    submitButton: {
        padding: '16px', 
        background: theme.primaryColor,
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '700',
        marginTop: '15px',
        fontSize: '1.2rem', 
        transition: 'background-color 0.3s, transform 0.1s',
    },
    submitButtonHover: {
        backgroundColor: theme.primaryDark,
        transform: 'translateY(-2px)', 
        boxShadow: '0 5px 15px rgba(0, 123, 255, 0.4)',
    },
    submitButtonDisabled: {
        background: '#ccc',
        cursor: 'not-allowed',
        transform: 'none',
    },
    totalPriceContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e6f0ff',
        borderRadius: '8px',
        padding: '15px',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    totalPriceLabel: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: theme.primaryDark,
    },
    totalPriceValue: {
        color: theme.primaryDark,
        fontSize: '1.5rem',
        fontWeight: '800',
    }
};

const calculateTotalPrice = (startDate, endDate, pricePerDay) => {
    if (!startDate || !endDate || pricePerDay === undefined) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) return 0;

    const timeDiff = end.getTime() - start.getTime();
    const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 

    return dayCount > 0 ? dayCount * pricePerDay : 0;
};


export default function ReservationForm({ car, onClose }) {
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        drivers_license: null,
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isHoveringClose, setIsHoveringClose] = useState(false);
    const [isHoveringFile, setIsHoveringFile] = useState(false);
    const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null); 

    useEffect(() => {
        const price = calculateTotalPrice(formData.start_date, formData.end_date, car.price_per_day);
        setTotalPrice(price);
    }, [formData.start_date, formData.end_date, car.price_per_day]);


    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.start_date || !formData.end_date || !formData.drivers_license || totalPrice <= 0) {
            toast.error("Please fill all fields and select valid dates.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('vehicle_id', car.id);
        data.append('start_date', formData.start_date);
        data.append('end_date', formData.end_date);
        data.append('total_price', totalPrice);
        data.append('drivers_license', formData.drivers_license);

        try {
            await apiClient.post('/reservations', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
                
            toast.success("Reservation successful!");
            onClose(); 

        } catch (error) {
            console.error("Reservation Error:", error.response || error);
            toast.error(error.response?.data?.message || "Reservation failed. Check dates and network.");
        } finally {
            setLoading(false);
        }
    };

    const isSubmitDisabled = loading || totalPrice <= 0;

    return (
        <div style={formStyles.formCard} onClick={(e) => e.stopPropagation()}>
            <button 
                style={{...formStyles.closeButton, ...(isHoveringClose ? formStyles.closeButtonHover : {})}} 
                onClick={onClose} 
                aria-label="Close form"
                onMouseEnter={() => setIsHoveringClose(true)}
                onMouseLeave={() => setIsHoveringClose(false)}
            >
                &times;
            </button>

            <h2 style={formStyles.header}>📝 Reserve **{car.brand} {car.model}**</h2>

            <div style={formStyles.detailContainer}>
                <div style={formStyles.detailLabel}>Daily Rate:</div>
                <div style={formStyles.detailValue}>{car.price_per_day} DH</div>
            </div>

            <form onSubmit={handleSubmit}>
                
                <div style={formStyles.inputGroup}>
                    <label style={formStyles.label} htmlFor="start_date">Start Date</label>
                    <input 
                        style={{...formStyles.input, ...(focusedInput === 'start_date' ? formStyles.inputFocus : {})}} 
                        type="date" 
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange} 
                        onFocus={() => setFocusedInput('start_date')}
                        onBlur={() => setFocusedInput(null)}
                        required 
                    />
                </div>

                <div style={formStyles.inputGroup}>
                    <label style={formStyles.label} htmlFor="end_date">End Date</label>
                    <input 
                        style={{...formStyles.input, ...(focusedInput === 'end_date' ? formStyles.inputFocus : {})}} 
                        type="date" 
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange} 
                        onFocus={() => setFocusedInput('end_date')}
                        onBlur={() => setFocusedInput(null)}
                        min={formData.start_date} 
                        required 
                    />
                </div>
                
                <div style={formStyles.totalPriceContainer}>
                    <div style={formStyles.totalPriceLabel}>Total Estimated Price:</div>
                    <div style={formStyles.totalPriceValue}>
                        {totalPrice.toFixed(2)} DH
                    </div>
                </div>

                <div style={formStyles.inputGroup}>
                    <label style={formStyles.label} htmlFor="drivers_license">Drivers License (File)</label>
                    <input
                        style={{...formStyles.input, display: 'none'}} 
                        type="file"
                        id="drivers_license"
                        name="drivers_license"
                        onChange={handleInputChange}
                        accept="image/*,application/pdf"
                        required
                    />
                    <label 
                        htmlFor="drivers_license" 
                        style={{...formStyles.fileInputLabel, ...(isHoveringFile ? formStyles.fileInputLabelHover : {})}}
                        onMouseEnter={() => setIsHoveringFile(true)}
                        onMouseLeave={() => setIsHoveringFile(false)}
                    >
                        {formData.drivers_license 
                            ? `✅ Selected: ${formData.drivers_license.name}` 
                            : "📎 Choose File (Image or PDF)"}
                    </label>
                </div>

                <button 
                    style={{
                        ...formStyles.submitButton, 
                        ...(isSubmitDisabled ? formStyles.submitButtonDisabled : (isHoveringSubmit ? formStyles.submitButtonHover : {})),
                    }} 
                    type="submit" 
                    disabled={isSubmitDisabled}
                    onMouseEnter={() => setIsHoveringSubmit(true)}
                    onMouseLeave={() => setIsHoveringSubmit(false)}
                >
                    {loading 
                        ? '⏱️ Reserving...' 
                        : (totalPrice > 0 ? `Confirm Reservation (${totalPrice.toFixed(2)} DH)` : 'Select Dates')}
                </button>
            </form>
        </div>
    );
}