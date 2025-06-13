import React from 'react';
import './Header.scss';

interface Props {
  children?: React.ReactNode;
}

const Header: React.FC<Props> = ({ children }) => {
  return (
    <header className="app-header">
      {children}
    </header>
  );
};

export default Header;
