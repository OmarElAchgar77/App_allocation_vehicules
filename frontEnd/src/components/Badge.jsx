import React from 'react';

function Badge({ children }){ 
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">{children}</span>; 
}
export default Badge;