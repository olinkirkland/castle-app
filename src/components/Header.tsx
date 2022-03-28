import React from 'react';

function Header() {
  return (
    <header>
      <div className="container">
        <i className="fa-solid fa-crown"></i>
        <h2>
          Castle App
          <span className="muted"> | A Search Tool for European Castles</span>
        </h2>
      </div>
    </header>
  );
}

export default Header;
