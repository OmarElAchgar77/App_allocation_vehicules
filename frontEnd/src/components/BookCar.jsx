import { useState, useEffect, useRef } from "react"; 
import { apiClient } from '../api/api'; 
import { toast, ToastContainer } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';

const calculateTotalPrice = (startDate, endDate, pricePerDay) => {
    if (!startDate || !endDate || pricePerDay === undefined || pricePerDay === null) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start) || isNaN(end) || start > end) return 0;

    const timeDiff = end.getTime() - start.getTime();
    

    const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 

    return dayCount > 0 ? dayCount * pricePerDay : 0;
};


function BookCar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const checkAuthStatus = () => {
        const token = localStorage.getItem('userToken');
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };
    
    const fileInputRef = useRef(null);

    const [availableCars, setAvailableCars] = useState([]);
    const [locations] = useState([
        "Agadir", "Marakesh", "Casa Blanca", "Tange", "Fes", "Sawira"
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [carType, setCarType] = useState("");
    const [pickUp, setPickUp] = useState("");
    const [dropOff, setDropOff] = useState("");
    const [pickTime, setPickTime] = useState("");
    const [dropTime, setDropTime] = useState("");
    
    const [licenseFile, setLicenseFile] = useState(null); 
    const [licenseFileName, setLicenseFileName] = useState("");

    useEffect(() => {
        fetchAvailableCars();
        checkAuthStatus(); 
    }, []);

    const fetchAvailableCars = async () => {
        try {
            const response = await apiClient.get('/vehicles'); 
            setAvailableCars(response.data.vehicles || response.data); 
        } catch (error) {
            console.error("Error fetching available cars:", error);
            toast.error("Failed to load cars. Please try again later.");
        }
    };

    const handleLicenseFileChange = (e) => {
        const file = e.target.files[0];
        setLicenseFile(file);
        setLicenseFileName(file ? file.name : "");
    };

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFormSubmit = async (e) => {
        if(!isAuthenticated){
          toast.error("Log In First");
          navigate('/auth');
          return;
        }
        

        const carToRent = availableCars.find(car => car.id.toString() === carType);

        if (!carToRent || pickUp === "" || dropOff === "" || pickTime === "" || dropTime === "" || !licenseFile) {
            toast.error("Veuillez remplir tous les champs obligatoires (y compris le fichier de permis).");
            return;
        }

        if (new Date(pickTime) >= new Date(dropTime)) {
             toast.error("La date de retrait doit être après la date de ramassage.");
             return;
        }

        setIsSubmitting(true);
        
        const totalPrice = calculateTotalPrice(pickTime, dropTime, carToRent.price_per_day);

        if (totalPrice <= 0) {
            toast.error("Veuillez sélectionner des dates de location valides.");
            setIsSubmitting(false);
            return;
        }
        
        
        const formData = new FormData();

        e.preventDefault();

        formData.append('vehicle_id', carToRent.id);
        formData.append('start_date', pickTime);
        formData.append('end_date', dropTime);
        formData.append('total_price', totalPrice);
        formData.append('drivers_license', licenseFile);


        try {
            await apiClient.post('/reservations', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
                
            toast.success("Reservation successful!");

        } catch (error) {
            console.error("Reservation Error:", error.response || error);
            toast.error(error.response?.data?.message || "Reservation failed. Check dates and network.");
        } finally {
            
            setCarType("");
            setPickUp("");
            setDropOff("");
            setPickTime("");
            setDropTime("");
            setLicenseFile(null); 
            setLicenseFileName(""); 
          }

    };

    return (
        <>
            <section id="booking-section" className="book-section">
                <div className="container">
                    <div className="book-content">
                        <div className="book-content__box">
                            <h2>Réserver une voiture</h2>

                            <form className="box-form" onSubmit={handleFormSubmit}>
                                <div className="box-form__car-type">
                                    <label>
                                        <i className="fa-solid fa-car"></i> &nbsp; Type de voiture <b>*</b>
                                    </label>
                                    <select value={carType} onChange={(e) => setCarType(e.target.value)} required>
                                        <option value="">Sélectionnez le type de votre voiture</option>
                                        {availableCars.map((car) => (
                                            <option key={car.id} value={car.id}>
                                                {`${car.brand} ${car.model} (${car.price_per_day} DH/jour)`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="box-form__car-type">
                                    <label>
                                        <i className="fa-solid fa-location-dot"></i> &nbsp; Ramasser <b>*</b>
                                    </label>
                                    <select value={pickUp} onChange={(e) => setPickUp(e.target.value)} required>
                                        <option value="">Sélectionnez le lieu de prise en charge</option>
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="box-form__car-type">
                                    <label>
                                        <i className="fa-solid fa-location-dot"></i> &nbsp; Dépôt <b>*</b>
                                    </label>
                                    <select value={dropOff} onChange={(e) => setDropOff(e.target.value)} required>
                                        <option value="">Sélectionnez le lieu de prise en charge</option>
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="box-form__car-time">
                                    <label htmlFor="picktime">
                                        <i className="fa-regular fa-calendar-days "></i> &nbsp;
                                        Date de ramassage <b>*</b>
                                    </label>
                                    <input
                                        id="picktime"
                                        value={pickTime}
                                        onChange={(e) => setPickTime(e.target.value)}
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]} 
                                        required
                                    ></input>
                                </div>

                                <div className="box-form__car-time">
                                    <label htmlFor="droptime">
                                        <i className="fa-regular fa-calendar-days "></i> &nbsp;
                                        Date de retrait <b>*</b>
                                    </label>
                                    <input
                                        id="droptime"
                                        value={dropTime}
                                        onChange={(e) => setDropTime(e.target.value)}
                                        type="date"
                                        min={pickTime || new Date().toISOString().split('T')[0]}
                                        required
                                    ></input>
                                </div>
                                
                                <div className="box-form__car-time">
                                    <label htmlFor="license-display">
                                        <i className="fa-solid fa-address-card"></i> &nbsp;
                                        Permis de conduire (fichier) <b>*</b>
                                    </label>
                                    <div className="custom-file-input-container">
                                        {/* Hidden actual file input */}
                                        <input
                                            ref={fileInputRef}
                                            id="license"
                                            onChange={handleLicenseFileChange}
                                            type="file"
                                            accept="image/*, .pdf"
                                            required
                                            style={{ display: 'none' }} 
                                        />
                                        
                                        <div
                                            className="file-display"
                                            onClick={handleFileButtonClick}
                                            style={{
                                                padding: '13px 15px',
                                                border: '1px solid #ccc',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                backgroundColor: '#fff',
                                                color: licenseFileName ? '#333' : '#a9a9a9',
                                            }}
                                        >
                                            {licenseFileName || "Cliquez pour sélectionner un fichier (max 5MB)"}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Réservation en cours...' : 'Réserver'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <ToastContainer />
        </>
    );
}

export default BookCar;