import '../styles/LegalPages.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-container">
            <div className="legal-card">
                <h1>Privacy Policy</h1>
                <p>Last updated: April 29, 2026</p>
                
                <section>
                    <h2>1. Introduction</h2>
                    <p>At TrendyTreasure, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>
                </section>

                <section>
                    <h2>2. Data We Collect</h2>
                    <p>We collect information that you provide directly to us when you make a purchase, create an account, or contact our support team. This includes:</p>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping/billing address.</li>
                        <li><strong>Payment Information:</strong> We use Razorpay for secure payments. Your payment details are processed directly by Razorpay and are not stored on our servers.</li>
                        <li><strong>Device Information:</strong> IP address, browser type, and operating system used to access our site.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Data</h2>
                    <p>We use the collected data to:</p>
                    <ul>
                        <li>Process and fulfill your orders.</li>
                        <li>Communicate with you regarding your account or purchases.</li>
                        <li>Improve our website functionality and customer service.</li>
                        <li>Send promotional emails (only if you have opted in).</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Data Security</h2>
                    <p>We implement industry-standard security measures, including SSL encryption, to protect your personal information from unauthorized access or disclosure.</p>
                </section>

                <section>
                    <h2>5. Third-Party Sharing</h2>
                    <p>We do not sell or rent your personal data to third parties. We only share information with trusted partners (like courier services and payment processors) necessary to fulfill your orders.</p>
                </section>

                <section>
                    <h2>6. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at <strong>trendytreasure0813@gmail.com</strong>.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
