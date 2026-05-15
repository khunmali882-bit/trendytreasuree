import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Recommendations.css';

const Recommendations = ({ currentProductId, category }) => {
    const [products, setProducts] = useState([]);
    const { addToCart, formatPrice } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/products.json')
            .then(r => r.json())
            .then(data => setProducts(data.filter(p => p.category === category && p.id != currentProductId).slice(0, 4)));
    }, [currentProductId, category]);

    if (!products.length) return null;

    return (
        <div className="recommendations">
            <h3>You May Also Like</h3>
            <div className="rec-grid">
                {products.map(p => (
                    <div key={p.id} className="rec-card">
                        <img src={p.imageUrl} alt={p.name} onClick={() => navigate(`/product/${p.id}`)} />
                        <div className="rec-info">
                            <p onClick={() => navigate(`/product/${p.id}`)}>{p.name}</p>
                            <span>{formatPrice(p.price)}</span>
                            <button className="btn-primary" onClick={() => addToCart(p)}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
