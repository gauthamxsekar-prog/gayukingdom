"use client";

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="gk-header">
      <div className="gk-brand">
        <span className="gk-logo">GK</span>
        <div className="gk-title-group">
          <span className="gk-title">GAYUKINGDOM</span>
          <span className="gk-subtitle">Trading Journal</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
