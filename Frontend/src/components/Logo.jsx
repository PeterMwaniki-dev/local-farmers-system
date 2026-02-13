// src/components/Logo.jsx
// Reusable logo component

import { Link } from 'react-router-dom';

const Logo = ({ to = "/", className = "", textSize = "text-xl" }) => {
  return (
    <Link to={to} className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/Images/canvas.png" 
        alt="Shamba Sense Logo" 
        className="w-10 h-10 object-contain"
      />
      <span className={`${textSize} font-bold text-green-600`}>Shamba Sense</span>
    </Link>
  );
};

export default Logo;