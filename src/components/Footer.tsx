import React from 'react';

function Footer() {
  return (
    <footer className='container'>
      <span>Design and code © 2021 by Olin Kirkland</span>
      <span className="text-divider">|</span>
      <span>Data from the </span>
      <a
        className="btn"
        href="https://www.ebidat.de"
        target="_blank"
        rel="noreferrer"
      >
        European Castle Institute
        <i className="fa-solid fa-up-right-from-square"></i>
      </a>
    </footer>
  );
}

export default Footer;
