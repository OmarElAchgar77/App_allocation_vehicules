import React, { useState } from 'react';
import './Dashboard.css'; // Importing the CSS file

// You still need to install icons: npm install lucide-react
import { 
  LayoutDashboard, Car, CalendarDays, Users, Settings, LogOut, 
  Bell, Search, TrendingUp, DollarSign, Fuel, MapPin 
} from 'lucide-react';

// --- Mock Data ---
const statsData = [
  { title: "Total Revenue", value: "$54,230", icon: <DollarSign size={20} />, change: "+12%", colorClass: "bg-green", textClass: "text-green" },
  { title: "Active Rentals", value: "42", icon: <Car size={20} />, change: "+8%", colorClass: "bg-blue", textClass: "text-blue" },
  { title: "Available Cars", value: "18", icon: <MapPin size={20} />, change: "-2%", colorClass: "bg-purple", textClass: "text-red" },
  { title: "Pending Requests", value: "5", icon: <CalendarDays size={20} />, change: "+5%", colorClass: "bg-orange", textClass: "text-green" },
];

const bookingsData = [
  { id: "#ORD-001", user: "Alice Johnson", car: "Tesla Model 3", dates: "Oct 24 - Oct 26", status: "Active", price: "$240" },
  { id: "#ORD-002", user: "Michael Smith", car: "Toyota Rav4", dates: "Oct 25 - Oct 28", status: "Pending", price: "$180" },
  { id: "#ORD-003", user: "Emma Brown", car: "BMW X5", dates: "Oct 22 - Oct 24", status: "Completed", price: "$450" },
  { id: "#ORD-004", user: "James Wilson", car: "Ford Mustang", dates: "Oct 26 - Oct 27", status: "Confirmed", price: "$120" },
];

const fleetData = [
  { id: 1, name: "Tesla Model 3", plate: "ABC-123", status: "Rented", fuel: "80%", type: "Electric", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Mercedes C-Class", plate: "XYZ-789", status: "Available", fuel: "100%", type: "Petrol", image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Toyota Corolla", plate: "LMN-456", status: "Maintenance", fuel: "45%", type: "Hybrid", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=400" },
];

// --- Sub-Components ---
const StatusBadge = ({ status }) => (
  <span className={`badge status-${status}`}>{status}</span>
);

const DashboardHome = () => (
  <div className="view-container">
    <div className="stats-grid">
      {statsData.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-info">
            <p>{stat.title}</p>
            <h3>{stat.value}</h3>
            <span className={`stat-change ${stat.textClass}`}>{stat.change} from last month</span>
          </div>
          <div className={`icon-box ${stat.colorClass}`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>

    <div className="recent-orders">
      <div className="table-header">
        <h2>Recent Bookings</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Car</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {bookingsData.map((booking, idx) => (
            <tr key={idx}>
              <td>{booking.id}</td>
              <td>{booking.user}</td>
              <td>{booking.car}</td>
              <td>{booking.dates}</td>
              <td><StatusBadge status={booking.status} /></td>
              <td><strong>{booking.price}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const FleetView = () => (
  <div className="view-container">
    <div className="flex-between">
      <h2>Vehicle Fleet</h2>
      <button className="btn-primary">+ Add New Car</button>
    </div>
    <div className="fleet-grid">
      {fleetData.map((car) => (
        <div key={car.id} className="fleet-card">
          <img src={car.image} alt={car.name} className="car-image" />
          <div className="car-details">
            <div className="flex-between" style={{marginBottom: '5px'}}>
               <h3>{car.name}</h3>
               <StatusBadge status={car.status} />
            </div>
            <p style={{color: '#888', margin: 0}}>Plate: {car.plate}</p>
            <div className="car-specs">
              <div className="spec-item"><Fuel size={16} /> {car.type}</div>
              <div className="spec-item"><TrendingUp size={16} /> {car.fuel}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Layout ---
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <Car size={28} />
          <span>RentAdmin</span>
        </div>

        <nav className="nav-links">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => setActiveTab('fleet')}>
            <Car size={20} /> Fleet
          </button>
          <button className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            <CalendarDays size={20} /> Bookings
          </button>
          <button className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            <Users size={20} /> Customers
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="logout-container">
          <button className="logout-btn">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-actions">
            <Bell size={20} color="#6b7280" />
            <div className="user-profile">
              <div style={{textAlign: 'right'}}>
                <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Admin User</div>
                <div style={{fontSize: '0.75rem', color: '#666'}}>Manager</div>
              </div>
              <div className="avatar">AD</div>
            </div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'fleet' && <FleetView />}
          {activeTab === 'bookings' && <div className="view-container"><h2>Bookings View (Coming Soon)</h2></div>}
        </div>
      </main>
    </div>
  );
}