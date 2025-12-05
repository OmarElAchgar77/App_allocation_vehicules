// Inside Reserves.jsx
import ReservationList from '../components/ReservationList'; 

export default function Reserves() {
    const reservesStyle = {
        paddingTop: "80px"
    };

  return (
    <div style={reservesStyle}>
      <ReservationList />
    </div>
  );
}