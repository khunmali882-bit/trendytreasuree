import '../styles/LegalPages.css';

const RefundPolicy = () => {
    return (
        <div className="legal-container">
            <div className="legal-card">
                <h1>Refund & Cancellation Policy</h1>
                <p>Last updated: April 29, 2026</p>

                <section>
                    <h2>1. Cancellation Policy</h2>
                    <p>You can cancel your order within 24 hours of placing it, or before it has been shipped, whichever is earlier. Once an order is shipped, it cannot be cancelled.</p>
                    <p>To cancel an order, please email us at <strong>trendytreasure0813@gmail.com</strong> with your order ID.</p>
                </section>

                <section>
                    <h2>2. Returns Policy</h2>
                    <p>We accept returns within <strong>7 days</strong> of delivery if the product is:</p>
                    <ul>
                        <li>Damaged or defective upon arrival.</li>
                        <li>Incorrect item sent.</li>
                        <li>Unused and in its original packaging with all tags intact.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Refund Process</h2>
                    <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund.</p>
                    <ul>
                        <li><strong>Approved Refunds:</strong> Will be processed and credited to your original payment method (via Razorpay) within <strong>7-10 business days</strong>.</li>
                        <li><strong>Shipping Costs:</strong> Original shipping charges are non-refundable unless the return is due to our error.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Non-Returnable Items</h2>
                    <p>Certain items such as personalized products, innerwear, or clearance sale items may not be eligible for return or refund.</p>
                </section>

                <section>
                    <h2>5. Contact for Support</h2>
                    <p>If you have any issues with your order, please reach out to our support team at <strong>trendytreasure0813@gmail.com</strong> or call us at <strong>+91 9727013000</strong>.</p>
                </section>
            </div>
        </div>
    );
};

export default RefundPolicy;
