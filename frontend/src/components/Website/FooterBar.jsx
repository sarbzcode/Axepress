import React from "react";
import '@styles/FooterBar.css';

const FooterBar = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">&copy; {new Date().getFullYear()} Axepress</p>
        <p className="credit">Built with ❤️ by Web Alpha</p>
      </div>
    </footer>
  );
};

export default FooterBar;
