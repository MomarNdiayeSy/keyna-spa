// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';

// Pages temporaires pour les routes (à remplacer par vos composants réels)
const Services = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">Nos Services</h1>
    <p>Cette page affichera la liste des services du spa.</p>
  </div>
);

const Shop = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">Boutique</h1>
    <p>Cette page affichera les produits disponibles à l'achat.</p>
  </div>
);

const VipSpace = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">Espace VIP</h1>
    <p>Cette page affichera les offres exclusives pour les membres VIP.</p>
  </div>
);

const Booking = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">Réservation</h1>
    <p>Cette page permettra aux clients de réserver un rendez-vous.</p>
  </div>
);

const Contact = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">Contact</h1>
    <p>Cette page affichera les informations de contact et un formulaire.</p>
  </div>
);

const About = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">À Propos</h1>
    <p>Cette page présentera l'histoire et les valeurs de KEYNA SPA.</p>
  </div>
);

const Testimonials = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">Témoignages</h1>
    <p>Cette page affichera tous les témoignages de clients satisfaits.</p>
  </div>
);

const Cart = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">Panier</h1>
    <p>Cette page affichera les produits ajoutés au panier.</p>
  </div>
);

const Login = () => (
  <div className="container mx-auto px-4 py-24">
    <h1 className="text-3xl font-serif font-bold mb-6">Connexion</h1>
    <p>Cette page permettra aux utilisateurs de se connecter à leur compte.</p>
  </div>
);

const NotFound = () => (
  <div className="container mx-auto px-4 py-24 text-center">
    <h1 className="text-5xl font-serif font-bold mb-6">404</h1>
    <p className="text-xl mb-6">Page non trouvée</p>
    <a href="/" className="btn btn-primary">Retour à l'accueil</a>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/vip" element={<VipSpace />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;