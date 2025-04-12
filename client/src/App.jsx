import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import './App.css';
import TrendingProducts from './pages/TrandingProducts';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0c0e16]"> {/* Make sure background color is consistent */}
        <Header />
        <main className="flex-grow flex flex-col"> {/* Added flex flex-col */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections/:collectionHandle" element={<Collection />} />
            <Route path="/collections/all" element={<Collection />} />
            <Route path="/products/:handle" element={<ProductDetails />} />
            <Route path="/trending" element={<TrendingProducts />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;