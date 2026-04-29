import '../styles/LegalPages.css';

const ContactUs = () => {
    return (
        <div className="legal-container">
            <div className="legal-card">
                <h1>Contact Us</h1>
                <p>We are here to help! If you have any questions, concerns, or feedback, please reach out to us using any of the methods below.</p>
                
                <div className="contact-grid">
                    <div className="contact-item">
                        <h3>📧 Email Support</h3>
                        <p>For order inquiries and support:</p>
                        <p><strong>trendytreasure0813@gmail.com</strong></p>
                    </div>

                    <div className="contact-item">
                        <h3>📞 Phone Support</h3>
                        <p>Monday - Saturday (10 AM - 7 PM):</p>
                        <p><strong>+91 9727013000</strong></p>
                        <p><strong>+91 9512345988</strong></p>
                    </div>

                    <div className="contact-item">
                        <h3>📍 Registered Address</h3>
                        <p>TrendyTreasure Pvt Ltd,</p>
                        <p>123 Luxury Street, Bandra West,</p>
                        <p>Mumbai, Maharashtra, 400050, India</p>
                    </div>
                </div>

                <section style={{ marginTop: '40px', textAlign: 'center' }}>
                    <h2>Follow Our Journey</h2>
                    <p>Stay updated with our latest collections and offers on social media.</p>
                </section>
            </div>
        </div>
    );
};

export default ContactUs;
