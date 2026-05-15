import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductReview from './ProductReview';
import Recommendations from './Recommendations';
import { addToRecentlyViewed } from './RecentlyViewed';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, formatPrice } = useCart();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        fetch('/products.json')
            .then(res => res.json())
            .then(data => {
                const product = data.find(p => String(p.id) === id);
                setProduct(product);
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
                addToRecentlyViewed(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="pd-loader"><div className="loader"></div></div>;
    if (!product) return <div className="pd-loader"><p>Product not found</p></div>;

    const images = product.images || [product.imageUrl];

    return (
        <div className="pd-container">

            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="pd-back">← Back</button>

            {/* Main Image */}
            <div className="pd-main-img">
                <img src={images[activeImg]} alt={product.name} />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
                <div className="pd-thumbnails">
                    {images.map((img, idx) => (
                        <div key={idx} className={`pd-thumb ${activeImg === idx ? 'active' : ''}`} onClick={() => setActiveImg(idx)}>
                            <img src={img} alt={`view ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            )}

            {/* Product Info */}
            <div className="pd-info">
                <p className="pd-category">{product.category}</p>
                <h1 className="pd-name">{product.name}</h1>
                <p className="pd-price">{formatPrice(selectedVariant ? selectedVariant.price : product.price)}</p>
                {(selectedVariant ? selectedVariant.originalPrice : product.originalPrice) > (selectedVariant ? selectedVariant.price : product.price) && (
                    <div className="pd-price-row">
                        <span className="pd-original-price">{formatPrice(selectedVariant ? selectedVariant.originalPrice : product.originalPrice)}</span>
                        <span className="pd-discount-badge">{Math.round((((selectedVariant ? selectedVariant.originalPrice : product.originalPrice) - (selectedVariant ? selectedVariant.price : product.price)) / (selectedVariant ? selectedVariant.originalPrice : product.originalPrice)) * 100)}% off</span>
                    </div>
                )}

                {product.variants && product.variants.length > 0 && (
                    <div className="pd-variants-section">
                        <p className="pd-variants-label">Colour: <strong>{selectedVariant?.color}</strong></p>
                        <div className="pd-variants-list">
                            {product.variants.map((variant, idx) => (
                                <div 
                                    key={idx} 
                                    className={`pd-variant-card ${selectedVariant?.color === variant.color ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedVariant(variant);
                                        const imgIdx = images.indexOf(variant.image);
                                        if (imgIdx !== -1) setActiveImg(imgIdx);
                                    }}
                                >
                                    <div className="pd-variant-img">
                                        <img src={variant.image} alt={variant.color} />
                                    </div>
                                    <div className="pd-variant-info">
                                        <span className="pd-variant-name">{variant.color}</span>
                                        <span className="pd-variant-price">{formatPrice(variant.price)}</span>
                                        {variant.originalPrice > variant.price && (
                                            <span className="pd-variant-original">{formatPrice(variant.originalPrice)}</span>
                                        )}
                                        <span className="pd-limited-badge">Limited time</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pd-divider"></div>

                <h3 className="pd-section-title">Product Description</h3>
                <p className="pd-description">{product.description}</p>

                <div className="pd-divider"></div>

                {/* Quantity */}
                <div className="pd-qty-row">
                    <span className="pd-qty-label">Quantity</span>
                    <div className="pd-qty-controls">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="pd-buttons">
                    <button className="pd-btn-cart" onClick={() => addToCart({ 
                        ...product, 
                        quantity, 
                        price: selectedVariant ? selectedVariant.price : product.price,
                        color: selectedVariant?.color,
                        image: selectedVariant ? selectedVariant.image : product.imageUrl 
                    })}>
                        🛒 Add to Cart
                    </button>
                    <button className="pd-btn-buy" onClick={() => { 
                        addToCart({ 
                            ...product, 
                            quantity, 
                            price: selectedVariant ? selectedVariant.price : product.price,
                            color: selectedVariant?.color,
                            image: selectedVariant ? selectedVariant.image : product.imageUrl 
                        }); 
                        navigate('/checkout'); 
                    }}>
                        ⚡ Buy Now
                    </button>
                </div>

                {/* Delivery Info */}
                <div className="pd-delivery">
                    <div className="pd-delivery-item">📦 <span>Delivery charges depend on weight</span></div>
                    <div className="pd-delivery-item">↩️ <span>7 Day Easy Returns</span></div>
                    <div className="pd-delivery-item">✅ <span>100% Authentic Product</span></div>
                </div>
            </div>

            <ProductReview productId={id} />
            <Recommendations currentProductId={id} category={product.category} />
        </div>
    );
};

export default ProductDetail;
