import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';
import '../styles/Payment.css';

const Payment = () => {
    const { cart, cartTotal, formatPrice, clearCart } = useCart();
    const { token, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const shippingAddress = location.state?.shippingAddress || {};
    
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [processing, setProcessing] = useState(false);

    // Load Razorpay script (skip if already loaded)
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Handle Razorpay Payment
    const handleRazorpayPayment = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setProcessing(true);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert('Failed to load Razorpay SDK. Please try again.');
                setProcessing(false);
                return;
            }


            // Create order on backend
            const orderResponse = await fetch(`${API_BASE_URL}/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(cartTotal * 100), // Convert to paise
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`
                })
            });

            const responseText = await orderResponse.text();
            
            if (!orderResponse.ok) {
                let errorMessage = 'Failed to create order';
                try {
                    const errorJson = JSON.parse(responseText);
                    errorMessage = errorJson.error || errorJson.message || errorMessage;
                } catch (e) {
                    errorMessage = `Server Error (${orderResponse.status}): ${responseText.substring(0, 100)}`;
                }
                throw new Error(errorMessage);
            }

            let orderData;
            try {
                orderData = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Invalid response from server. Status: ${orderResponse.status}. Content: ${responseText.substring(0, 100)}`);
            }

            if (!orderData.success) {
                throw new Error(orderData.message || 'Failed to create order');
            }

            // Configure Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'TrendyTreasure',
                description: 'Purchase from TrendyTreasure',
                order_id: orderData.order_id,
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        const verifyResponse = await fetch(`${API_BASE_URL}/verify-payment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyText = await verifyResponse.text();

                        if (!verifyResponse.ok) {
                            let errorMessage = 'Payment verification failed';
                            try {
                                const errorJson = JSON.parse(verifyText);
                                errorMessage = errorJson.error || errorJson.message || errorMessage;
                            } catch (e) {
                                errorMessage = `Verification Error (${verifyResponse.status}): ${verifyText.substring(0, 100)}`;
                            }
                            throw new Error(errorMessage);
                        }

                        let verifyData;
                        try {
                            verifyData = JSON.parse(verifyText);
                        } catch (e) {
                            throw new Error(`Invalid verification response. Status: ${verifyResponse.status}. Content: ${verifyText.substring(0, 100)}`);
                        }

                        if (verifyData.success) {
                            // Payment successful
                            clearCart();
                            navigate('/order-confirmation', {
                                state: {
                                    orderData: {
                                        orderId: response.razorpay_order_id,
                                        paymentId: response.razorpay_payment_id,
                                        totalAmount: cartTotal,
                                        paymentMethod: 'Razorpay',
                                        shippingAddress
                                    }
                                }
                            });
                        } else {
                            throw new Error(verifyData.message || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        alert(error.message || 'Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: shippingAddress.phone || ''
                },
                notes: {
                    address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}`
                },
                theme: {
                    color: '#D4AF37'
                },
                modal: {
                    ondismiss: function() {
                        setProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                alert(`Payment failed: ${response.error.description}`);
                setProcessing(false);
            });
            razorpay.open();

        } catch (error) {
            console.error('Payment error:', error);
            alert(error.message || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    // Handle Cash on Delivery
    const handleCODPayment = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        setProcessing(true);
        
        // Simulate COD order creation
        setTimeout(() => {
            clearCart();
            navigate('/order-confirmation', { 
                state: { 
                    orderData: {
                        orderId: 'COD_' + Date.now(),
                        totalAmount: cartTotal,
                        paymentMethod: 'Cash on Delivery',
                        shippingAddress
                    }
                }
            });
        }, 1000);
    };

    const handlePayment = (e) => {
        e.preventDefault();
        
        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else if (paymentMethod === 'cod') {
            handleCODPayment();
        }
    };

    if (!cart.length) {
        return <div className="container section-padding"><p>No items to pay for. <a href="/">Continue Shopping</a></p></div>;
    }

    return (
        <div className="payment-container section-padding">
            <div className="container">
                <h2 className="section-title">Payment</h2>
                <div className="payment-grid">
                    <form className="payment-form" onSubmit={handlePayment}>
                        <h3>Select Payment Method</h3>
                        <div className="payment-methods">
                            <div className={`payment-method ${paymentMethod === 'razorpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('razorpay')}>
                                <h4>💳 Pay with Razorpay</h4>
                                <p>Credit/Debit Card, UPI, Net Banking, Wallets</p>
                            </div>
                            <div className={`payment-method ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                                <h4>💵 Cash on Delivery</h4>
                                <p>Pay when your order is delivered</p>
                            </div>
                        </div>

                        {paymentMethod === 'razorpay' && (
                            <div className="razorpay-info">
                                <p style={{color: 'var(--light-gray)', padding: '20px', textAlign: 'center'}}>
                                    🔒 Secure payment powered by Razorpay<br/>
                                    Supports all major cards, UPI, and wallets
                                </p>
                            </div>
                        )}

                        {paymentMethod === 'cod' && (
                            <p style={{color: 'var(--light-gray)', padding: '20px', textAlign: 'center'}}>
                                💵 Pay with cash when your order is delivered.<br/>
                                Additional charges may apply.
                            </p>
                        )}

                        <button type="submit" className="btn-primary" disabled={processing} style={{marginTop: '30px'}}>
                            {processing ? (
                                paymentMethod === 'razorpay' ? 'Opening Razorpay...' : 'Processing...'
                            ) : (
                                paymentMethod === 'razorpay' ? `Pay ${formatPrice(cartTotal)} with Razorpay` : `Place Order - ${formatPrice(cartTotal)}`
                            )}
                        </button>
                    </form>

                    <div className="payment-summary">
                        <h3>Order Summary</h3>
                        {cart.map((item) => (
                            <div key={item.id} className="summary-row">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
