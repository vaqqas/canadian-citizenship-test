import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          Submit a bug, Submit Questions, or just Say Thank You!:{' '}
          <a href="mailto:vaqqas.canada@gmail.com">vaqqas.canada@gmail.com</a>
        </p>
        <p className="footer-support">
          <a href="https://buymeacoffee.com/vaqqas" target="_blank" rel="noopener noreferrer">
            Buy me a Coffee
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
