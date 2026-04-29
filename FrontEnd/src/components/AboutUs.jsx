import '../styles/LegalPages.css';

const AboutUs = () => {
    return (
        <div className="legal-container">
            <div className="legal-card">
                <h1>About TrendyTreasure</h1>
                
                <section>
                    <h2>Our Story</h2>
                    <p>TrendyTreasure was founded in 2024 with a simple mission: to make luxury fashion accessible and trustworthy. We believe that everyone deserves to experience the elegance of high-end design without the complexity of traditional luxury shopping.</p>
                </section>

                <section>
                    <h2>What We Do</h2>
                    <p>We curate an exclusive collection of premium bags, beauty products, and fashion accessories from the world's most renowned designers. Every item in our catalog is handpicked for its quality, craftsmanship, and style.</p>
                </section>

                <section>
                    <h2>Why Choose Us?</h2>
                    <ul>
                        <li><strong>Authenticity Guaranteed:</strong> We only sell 100% genuine products sourced directly from authorized partners.</li>
                        <li><strong>Secure Shopping:</strong> Your data and payments are protected by industry-leading security (SSL and Razorpay).</li>
                        <li><strong>Customer First:</strong> Our support team is always here to ensure you have a seamless shopping experience.</li>
                    </ul>
                </section>

                <section>
                    <h2>Our Vision</h2>
                    <p>To become India's most trusted destination for luxury lifestyle products, known for our impeccable collection and exceptional customer service.</p>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
