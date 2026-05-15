import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/RecentlyViewed.css';

export const addToRecentlyViewed = (product) => {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = recent.filter(p => p.id != product.id);
    filtered.unshift(product);
    localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 6)));
};

const RecentlyViewed = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { formatPrice } = useCart();

    useEffect(() => {
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setProducts(recent);
    }, []);

    if (!products.length) return null;

    return (
        <section className="recently-viewed section-padding">
            <div className="container">
                <h2 className="section-title">Recently Viewed</h2>
                <div className="recent-grid">
                    {products.map(p => (
                        <div key={p.id} className="recent-card" onClick={() => navigate(`/product/${p.id}`)}>
                            <img src={p.imageUrl} alt={p.name} />
                            <p>{p.name}</p>
                            <span>{formatPrice(p.price)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewed;
