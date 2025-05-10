// frontend/src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import logo from '../../assets/logo.png'; // Assurez-vous d'avoir un logo dans vos assets

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="KEYNA SPA" className="h-10 w-auto" />
              <span className="ml-2 text-xl font-semibold text-white">KEYNA SPA</span>
            </Link>
            <p className="text-gray-100">
              KEYNA SPA vous offre une expérience de bien-être unique dans un cadre luxueux et apaisant.
              Découvrez nos services de qualité pour revitaliser votre corps et votre esprit.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-100 hover:text-white transition-colors">
                  Nos Services
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-100 hover:text-white transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/vip" className="text-gray-100 hover:text-white transition-colors">
                  Espace VIP
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-100 hover:text-white transition-colors">
                  Réservation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-100 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Heures d'ouverture */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Heures d'ouverture</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-100">
                <FiClock className="mr-2" /> Lundi - Vendredi: 9h - 20h
              </li>
              <li className="flex items-center text-gray-100">
                <FiClock className="mr-2" /> Samedi: 10h - 22h
              </li>
              <li className="flex items-center text-gray-100">
                <FiClock className="mr-2" /> Dimanche: 10h - 18h
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-100">
                <FiMapPin className="mr-2" /> 123 Rue du Spa, Ville
              </li>
              <li className="flex items-center text-gray-100">
                <FiPhone className="mr-2" /> +33 1 23 45 67 89
              </li>
              <li className="flex items-center text-gray-100">
                <FiMail className="mr-2" /> contact@keynaspa.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-100">
            &copy; {new Date().getFullYear()} KEYNA SPA. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm text-gray-100 hover:text-white">
              Politique de confidentialité
            </Link>
            <Link to="/terms" className="text-sm text-gray-100 hover:text-white">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;