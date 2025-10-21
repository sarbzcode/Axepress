import React from "react";
import '@styles/FooterBar.css'; // Import the CSS file for the footer styles

const FooterBar = () => {
  return (
    <footer className="footer">
      {/* Footer container */}
      <div className="footer-content">
        {/* Display the copyright message with dynamic year */}
        <p className="copyright">&copy; {new Date().getFullYear()} Axepress</p>

        {/* Display the credit message for the website's development */}
        <p className="credit">Built with ❤️ by Web Alpha</p>
      </div>
    </footer>
  );
};

export default FooterBar;