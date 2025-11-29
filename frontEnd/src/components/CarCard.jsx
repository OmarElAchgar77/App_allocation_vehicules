import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from './Badge';

function CarCard({ car }){
  return (
    <motion.article whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md overflow-hidden">
      <img src={car.image} alt="car" className="w-full h-44 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
            <div className="text-sm text-gray-500">{car.year} • {car.type}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${car.pricePerDay}/d</div>
            <div className="text-xs text-gray-500">est. price</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            {car.available ? <Badge>Available</Badge> : <Badge>Unavailable</Badge>}
            <span className="text-sm text-gray-500">Free cancellation</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/car/${car.id}`} className="px-3 py-1 border rounded-md text-sm">Details</Link>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">Book</button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default CarCard;