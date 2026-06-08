import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Upcoming from './pages/Upcoming';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import { MyEnquiriesList, MyEnquiryDetail } from './pages/dashboard/MyEnquiries';
import MyReviews from './pages/dashboard/MyReviews';
import MyNotifications from './pages/dashboard/MyNotifications';
import MyProfile from './pages/dashboard/MyProfile';
import MyWishlist from './pages/dashboard/MyWishlist';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
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
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<Register />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />
          <Route path="/reset-password"   element={<ResetPassword />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index                  element={<DashboardHome />} />
            <Route path="enquiries"       element={<MyEnquiriesList />} />
            <Route path="enquiries/:id"   element={<MyEnquiryDetail />} />
            <Route path="reviews"         element={<MyReviews />} />
            <Route path="notifications"   element={<MyNotifications />} />
            <Route path="profile"         element={<MyProfile />} />
            <Route path="wishlist"        element={<MyWishlist />} />
          </Route>

          <Route path="*" element={<div className="container mx-auto p-12 text-center text-gray-500">Page not found.</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
