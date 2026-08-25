import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageLoader from './components/PageLoader';
import EnquiryFab from './components/EnquiryFab';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Upcoming from './pages/Upcoming';
import UsedLaptops from './pages/UsedLaptops';
import Cctv from './pages/Cctv';

// Public storefront only — no customer login/registration or account area.
export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageLoader />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/used-laptops" element={<UsedLaptops />} />
          <Route path="/cctv" element={<Cctv />} />
          <Route path="*" element={<div className="container mx-auto p-12 text-center text-gray-500">Page not found.</div>} />
        </Routes>
      </main>
      <Footer />
      <EnquiryFab />
    </div>
  );
}
