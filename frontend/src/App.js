import React from 'react';
     import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
     import { CartProvider } from './contexts/CartContext';
     import Layout from './components/common/Layout';
     import Home from './pages/Home';
     import Services from './pages/Services';
     import Shop from './pages/Shop';
     import Booking from './pages/Booking';
     import Contact from './pages/Contact';
     import About from './pages/About';
     import PrivacyPolicy from './pages/PrivacyPolicy';
     import Terms from './pages/Terms';
     import Login from './pages/Login';
     import Register from './pages/Register';
     import Cart from './pages/Cart';
     import VipSpace from './pages/VipSpace';
     import Dashboard from './pages/admin/Dashboard';
     import UsersManagement from './pages/admin/UsersManagement';
     import ServicesManagement from './pages/admin/ServicesManagement';
     import ProductsManagement from './pages/admin/ProductsManagement';
     import BookingsManagement from './pages/admin/BookingsManagement';
     import Statistics from './pages/admin/Statistics';
     import VipOffersManagement from './pages/admin/VipOffersManagement';
     import History from './pages/History';
    //  import DiscountsManagement from './pages/DiscountsManagement';
     import PricingManagement from './pages/PricingManagement';
     import Pricing from './pages/Pricing';
    //  import ServiceDetail from './pages/ServiceDetail';
    // import TariffsManagement from './pages/admin/TariffsManagement';
    // import SchedulesManagement from './pages/admin/SchedulesManagement';
    // import DiscountsManagement from './pages/DiscountsManagement';

    import PrivateRoute from './components/PrivateRoute';
    import ServiceDetail from './pages/ServiceDetail';
    import TariffsManagement from './pages/admin/TariffsManagement';
    import SchedulesManagement from './pages/admin/SchedulesManagement';
    import DiscountsManagement from './pages/DiscountsManagement'

     const NotFound = () => (
         <div className="container mx-auto px-4 py-24 text-center">
             <h1 className="text-5xl font-serif font-bold mb-6">404</h1>
             <p className="text-xl mb-6">Page non trouvée</p>
             <a href="/" className="btn btn-primary">Retour à l'accueil</a>
         </div>
     );

     function App() {
         return (
             <CartProvider>
                 <Router>
                     <div className="pt-16">
                         <Layout>
                             <Routes>
                                 <Route path="/" element={<Home />} />
                                 <Route path="/services" element={<Services />} />
                                 <Route path="/shop" element={<Shop />} />
                                 <Route path="/vip" element={<VipSpace />} />
                                 <Route path="/booking" element={<Booking />} />
                                 <Route path="/contact" element={<Contact />} />
                                 <Route path="/about" element={<About />} />
                                 <Route path="/privacy" element={<PrivacyPolicy />} />
                                 <Route path="/terms" element={<Terms />} />
                                 <Route path="/cart" element={<Cart />} />
                                 <Route path="/login" element={<Login />} />
                                 <Route path="/register" element={<Register />} />
                                 <Route path="/admin" element={<Dashboard />} />
                                 <Route path="/admin/users" element={<UsersManagement />} />
                                 <Route path="/admin/services" element={<ServicesManagement />} />
                                 <Route path="/admin/products" element={<ProductsManagement />} />
                                 <Route path="/admin/bookings" element={<BookingsManagement />} />
                                 <Route path="/admin/statistics" element={<Statistics />} />
                                 <Route path="/admin/vip" element={<VipOffersManagement />} />
                                 <Route path="/history" element={<History />} />
                                 {/* <Route path="/admin/discounts" element={<DiscountsManagement />} /> */}
                                 <Route path="/admin/pricing" element={<PricingManagement />} />
                                 <Route path="/pricing" element={<Pricing />} />
                                 {/* <Route path="/service-details/:id" element={<ServiceDetail />} />
                                <Route path="/admin/services/:serviceId/tariffs" element={<TariffsManagement />} />
                                <Route path="/admin/schedules" element={<SchedulesManagement />} /> */}
                                <Route path="/service-details/:id" element={<ServiceDetail />} />
                                <Route path="/admin/services/:serviceId/tariffs" element={<PrivateRoute role="admin"><TariffsManagement /></PrivateRoute>} />
                                <Route path="/admin/schedules" element={<PrivateRoute role="admin"><SchedulesManagement /></PrivateRoute>} />
                                <Route path="/admin/discounts" element={<PrivateRoute role="admin"><DiscountsManagement /></PrivateRoute>} />
                                 <Route path="*" element={<NotFound />} />
                             </Routes>
                         </Layout>
                     </div>
                 </Router>
             </CartProvider>
         );
     }

     export default App;