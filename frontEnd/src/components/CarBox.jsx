import { useState } from "react";

function CarBox({ data, carID }) {
  const [carLoad, setCarLoad] = useState(true);
  return (
    <>
      {data[carID].map((car, id) => (
        <div key={id} className="box-cars">

          <div 
            className="pick-car"
            style={{ 
                width: '500px', 
                height: '300px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                overflow: 'hidden',
                marginTop: '-20px'
            }} 
        >
            {carLoad && <span className="loader"></span>}
            <img
                style={{ 
                    display: carLoad ? "none" : "block",
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain', 
                    margin: '0 auto', 
                }}
                src={car.img}
                alt="car_img"
                onLoad={() => setCarLoad(false)}
            />
          </div>
          <div className="pick-description">
            <div className="pick-description__price">
              <span>{car.price} DH</span>/ Jour
            </div>
            <div className="pick-description__table">
              <div className="pick-description__table__col">
                <span>Modèle</span>
                <span>{car.model}</span>
              </div>

              <div className="pick-description__table__col">
                <span>Marque</span>
                <span>{car.mark}</span>
              </div>

              <div className="pick-description__table__col">
                <span>Année</span>
                <span>{car.year}</span>
              </div>

              <div className="pick-description__table__col">
                <span>Portes</span>
                <span>{car.doors}</span>
              </div>

              <div className="pick-description__table__col">
                <span>AC</span>
                <span>{car.air}</span>
              </div>

              <div className="pick-description__table__col">
                <span>Transmission</span>
                <span>{car.transmission}</span>
              </div>

              <div className="pick-description__table__col">
                <span>Carburant</span>
                <span>{car.fuel}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default CarBox;
