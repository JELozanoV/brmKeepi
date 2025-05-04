import React from 'react';
import logoImage from '../assets/images/Fidex2.png';

const Logo = () => {
  return (
    <div className="fidex-logo">
      <img 
        src={logoImage} 
        alt="Fidex Logo"
        className="fidex-logo-image"
      />
    </div>
  );
};

export default Logo;