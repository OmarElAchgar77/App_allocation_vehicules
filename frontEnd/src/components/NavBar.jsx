import { Link } from "react-router-dom";
import Logo from "../images/logo/logo.jpg";
import { useState, useEffect } from "react";
import {apiClient, apiAdmin} from '../api/api';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthStatus = () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsAuthenticated(true);
      } else {
          setIsAuthenticated(false);
      }
  };
  
  // UseEffect now handles initial load AND listens for the event
  useEffect(() => {
    // Check status on initial load
    checkAuthStatus(); 

    // Add event listener for global state changes
    window.addEventListener('authChange', checkAuthStatus);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  const openNav = () => {
    setNav(!nav);
  };
  const handleAuth = (e) => {
    // If user is ALREADY logged in, we want to Log Out
    if (isAuthenticated) {
        e.preventDefault(); // <--- STOP the Link from going to /auth
        
        apiClient.post('/logout') // [cite: 1] Endpoint /logout
        .then(() => {
            toast.success("Signed out successfully");
        })
        .catch((err) => {
            console.error("Logout error", err);
        })
        .finally(() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            delete apiClient.defaults.headers.common['Authorization'];
            
            setIsAuthenticated(false);
            
            // Optional: Reload page to clear any other state/cache
            window.location.reload(); 
        });
    } 
  };

  return (
    <>
      <nav>
        <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
          <ToastContainer />
          <div onClick={openNav} className="mobile-navbar__close">
            <i className="fa-solid fa-xmark"></i>
          </div>
          <ul className="mobile-navbar__links">
            <li>
              <Link onClick={openNav} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="/about">
                About
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="/models">
                Models
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="/testimonials">
                Testimonials
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="/team">
                Our Team
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>


        <div className="navbar">
          <div className="navbar__img">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="logo-img" />
            </Link>
          </div>
          <ul className="navbar__links">
            <li>
              <Link className="home-link" to="/">
                Home
              </Link>
            </li>
            <li>
              {" "}
              <Link className="models-link" to="/models">
                Vehicle Models
              </Link>
            </li>
            <li>
              {" "}
              <Link className="testi-link" to="/testimonials">
                Testimonials
              </Link>
            </li>
            <li>
              {" "}
              <Link className="team-link" to="/team">
                Our Team
              </Link>
            </li>
            <li>
              {" "}
              <Link className="about-link" to="/about">
                About
              </Link>
            </li>
            <li>
              {" "}
              <Link className="contact-link" to="/contact">
                Contact
              </Link>
            </li> 
            { isAuthenticated?
              <li>
                {" "}
                <Link className="contact-link" to="/Reserves">
                  Réservations 
                </Link>
              </li> : <></>
            }
          </ul>
          <div className="navbar__buttons">
            <Link className="navbar__buttons__register" to={isAuthenticated ? "/" : "/auth"} onClick={handleAuth}>
              {isAuthenticated? "Log Out" : "Sign In"}
            </Link>
          </div>

          <div className="mobile-hamb" onClick={openNav}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
