import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import Checkout from './components/Checkout';
import Profile from './components/Profile';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './components/NotFound';
import ProductDetail from './components/ProductDetail';
import Wishlist from './components/Wishlist';
import Admin from './components/Admin';
import Payment from './components/Payment';
import OrderConfirmation from './components/OrderConfirmation';
import TermsPrivacy from './components/TermsPrivacy';
import TermsConditions from './components/TermsConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import RateUs from './components/RateUs';
import FlashSale from './components/FlashSale';
import RecentlyViewed from './components/RecentlyViewed';
import BottomNav from './components/BottomNav';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Home = () => {
  const location = useLocation();
  const isSearching = new URLSearchParams(location.search).has('search');
  const isCategory = new URLSearchParams(location.search).has('category');

  return (
    <>
      {!isSearching && !isCategory && <Hero />}
      {!isSearching && !isCategory && <Categories />}
      <FeaturedProducts />
      {!isSearching && !isCategory && <RecentlyViewed />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="app-shell">
            <FlashSale />
            <Header />
            <Cart />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/rate" element={<RateUs />} />
                <Route path="/terms" element={<TermsPrivacy />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
