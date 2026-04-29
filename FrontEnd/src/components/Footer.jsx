import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-logo">
                <span className="footer-tt">TT</span>
                <span className="footer-brand">TrendyTreasure</span>
            </div>
            <p className="footer-tagline">Luxury fashion & lifestyle</p>
            
            <div className="footer-sections">
                <div className="footer-section">
                    <h4>Company</h4>
                    <div className="footer-links">
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact Us</Link>
                        <Link to="/rate">Rate Us</Link>
                    </div>
                </div>
                
                <div className="footer-section">
                    <h4>Legal</h4>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                        <Link to="/refund">Refund Policy</Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <div className="footer-contact">
                        <p>📧 trendytreasure0813@gmail.com</p>
                        <p>📞 +91 9727013000</p>
                        <p>📍 Surat, Gujarat, India</p>
                    </div>
                </div>
            </div>

            <p className="footer-copy">© 2026 TrendyTreasure. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
