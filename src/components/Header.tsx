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
        <a className="btn btn-header" href="">
          <i className="fa-solid fa-right-to-bracket"></i>
          Login
        </a>
      </div>
    </header>
  );
}

export default Header;
