import React from 'react';

function Header() {
  return (
    <header>
      <div className="container">
        <div>
          <i className="fa-solid fa-crown"></i>
          <h2>
            Castle App
            <span className="muted"> | A Search Tool for European Castles</span>
          </h2>
        </div>
        <button className="btn btn-header">
          <i className="fa-solid fa-right-to-bracket"></i>
          Login
        </button>
      </div>
    </header>
  );
}

export default Header;
