import '../styles/LegalPages.css';

const TermsPrivacy = () => {
    return (
        <div className="legal-container section-padding">
            <div className="container">
                <h2 className="section-title">Terms & Privacy Policy</h2>
                <div className="legal-card">
                    <section>
                        <h3>Terms of Service</h3>
                        <p>By accessing TrendyTreasure, you agree to these terms. We reserve the right to modify these terms at any time.</p>
                        <ul>
                            <li>All products are subject to availability</li>
                            <li>Prices are in INR and may change without notice</li>
                            <li>Orders are subject to acceptance and verification</li>
                            <li>Returns accepted within 7 days of delivery</li>
                        </ul>
                    </section>

                    <section>
                        <h3>Privacy Policy</h3>
                        <p>We value your privacy and are committed to protecting your personal information.</p>
                        <ul>
                            <li><strong>Data Collection:</strong> We collect name, email, address, and payment information</li>
                            <li><strong>Data Usage:</strong> Information is used for order processing and delivery</li>
                            <li><strong>Data Security:</strong> We use encryption to protect your data</li>
                            <li><strong>Third Parties:</strong> We do not sell your information to third parties</li>
                            <li><strong>Cookies:</strong> We use cookies to enhance user experience</li>
                        </ul>
                    </section>

                    <section>
                        <h3>Refund Policy</h3>
                        <p>Refunds are processed within 7-10 business days after receiving the returned product.</p>
                    </section>

                    <section>
                        <h3>Contact</h3>
                        <p>For questions about these terms, contact us at trendytreasure0813@gmail.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPrivacy;
