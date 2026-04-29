import '../styles/LegalPages.css';

const TermsConditions = () => {
    return (
        <div className="legal-container">
            <div className="legal-card">
                <h1>Terms & Conditions</h1>
                <p>Last updated: April 29, 2026</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using TrendyTreasure, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
                </section>

                <section>
                    <h2>2. Products and Pricing</h2>
                    <ul>
                        <li>We strive to provide accurate product descriptions and pricing. However, errors may occur.</li>
                        <li>We reserve the right to correct any errors and change prices without prior notice.</li>
                        <li>All products are subject to availability.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Orders and Payments</h2>
                    <ul>
                        <li>By placing an order, you represent that you are legally capable of entering into a binding contract.</li>
                        <li>Payments are processed securely through Razorpay.</li>
                        <li>We reserve the right to refuse or cancel any order for reasons including product unavailability or suspicion of fraud.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Shipping and Delivery</h2>
                    <p>We aim to deliver products within the estimated timelines provided at checkout. However, delays may occur due to unforeseen circumstances or carrier issues.</p>
                </section>

                <section>
                    <h2>5. Intellectual Property</h2>
                    <p>All content on this website, including text, graphics, logos, and images, is the property of TrendyTreasure and is protected by copyright laws.</p>
                </section>

                <section>
                    <h2>6. Limitation of Liability</h2>
                    <p>TrendyTreasure shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>
                </section>

                <section>
                    <h2>7. Governing Law</h2>
                    <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Surat, Gujarat.</p>
                </section>
            </div>
        </div>
    );
};

export default TermsConditions;
