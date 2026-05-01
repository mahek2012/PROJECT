import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ProductList = lazy(() => import('./pages/ProductList'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Offers = lazy(() => import('./pages/Offers'));
const Contact = lazy(() => import('./pages/Contact'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const FAQ = lazy(() => import('./pages/FAQ'));
const About = lazy(() => import('./pages/About'));
const FlashSale = lazy(() => import('./pages/FlashSale'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminShipping = lazy(() => import('./pages/admin/AdminShipping'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products" element={<ProductList />} />
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="offers" element={<Offers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="about" element={<About />} />
          <Route path="flash-sale" element={<FlashSale />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Admin Routes - Different Layout */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="shipping" element={<AdminShipping />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}


export default App;
