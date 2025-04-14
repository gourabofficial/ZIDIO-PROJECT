import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import TrendingProducts from './pages/TrandingProducts';
import HotProduct from './pages/HotProduct';
import SmoothScrollWrapper from './components/common/SmoothScrollWraper';
import CropTopsPage from './components/WomenCollection/CroptopPages';

import Cart from './pages/CartPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';
import Auth from './components/Auth/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SmoothScrollWrapper>
            <div className="flex flex-col min-h-screen bg-[#0c0e16]">
              <Header />
              <main className="flex-grow flex flex-col">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/collections/:collectionHandle" element={<Collection />} />
                  <Route path="/collections/all" element={<Collection />} />
                  <Route path="/products/:handle" element={<ProductDetails />} />
                  <Route path="/trending" element={<TrendingProducts />} />
                  <Route path="/hotproduct" element={<HotProduct />} />
                  <Route path="/crop-top" element={<CropTopsPage />} />
                  <Route path="/account" element={<Auth />} />
                  
                  <Route path="/cart" element={<Cart/>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SmoothScrollWrapper>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;