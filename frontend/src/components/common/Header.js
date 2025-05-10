// frontend/src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import logo from '../../assets/logo.png'; // Assurez-vous d'avoir un logo dans vos assets

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Effet pour détecter le scroll et changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour fermer le menu mobile
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="KEYNA SPA" className="h-12 w-auto" />
            <span className={`ml-2 text-xl font-semibold ${isScrolled ? 'text-primary' : 'text-white'}`}>
              KEYNA SPA
            </span>
          </Link>
          
          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks isScrolled={isScrolled} />
            <div className="flex items-center space-x-4">
              <Link 
                to="/cart" 
                className={`p-2 rounded-full ${isScrolled ? 'text-primary hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
              >
                <FiShoppingCart className="text-xl" />
              </Link>
              <Link 
                to="/login" 
                className={`p-2 rounded-full ${isScrolled ? 'text-primary hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
              >
                <FiUser className="text-xl" />
              </Link>
              <Link 
                to="/booking" 
                className={`px-5 py-2 rounded-full ${
                  isScrolled 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-white text-primary hover:bg-white/90'
                }`}
              >
                Réserver
              </Link>
            </div>
          </nav>
          
          {/* Hamburger Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <FiX className={`text-2xl ${isScrolled ? 'text-primary' : 'text-white'}`} />
            ) : (
              <FiMenu className={`text-2xl ${isScrolled ? 'text-primary' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 z-50">
          <div className="flex flex-col space-y-4">
            <MobileNavLinks closeMenu={closeMenu} />
            <div className="pt-4 border-t border-gray-200">
              <Link 
                to="/booking" 
                className="block w-full text-center px-5 py-2 rounded-full bg-primary text-white"
                onClick={closeMenu}
              >
                Réserver
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Composant pour les liens de navigation
const NavLinks = ({ isScrolled }) => {
  const textColor = isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-white/80';
  
  return (
    <>
      <Link to="/" className={textColor}>Accueil</Link>
      <Link to="/services" className={textColor}>Services</Link>
      <Link to="/shop" className={textColor}>Boutique</Link>
      <Link to="/vip" className={textColor}>Espace VIP</Link>
      <Link to="/contact" className={textColor}>Contact</Link>
    </>
  );
};

// Composant pour les liens de navigation mobile
const MobileNavLinks = ({ closeMenu }) => {
  return (
    <>
      <Link to="/" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
        Accueil
      </Link>
      <Link to="/services" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
        Services
      </Link>
      <Link to="/shop" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
        Boutique
      </Link>
      <Link to="/vip" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
        Espace VIP
      </Link>
      <Link to="/contact" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
        Contact
      </Link>
      <div className="flex items-center justify-between py-2">
        <Link to="/cart" className="text-gray-800 hover:text-primary flex items-center" onClick={closeMenu}>
          <FiShoppingCart className="mr-2" /> Panier
        </Link>
        <Link to="/login" className="text-gray-800 hover:text-primary flex items-center" onClick={closeMenu}>
          <FiUser className="mr-2" /> Compte
        </Link>
      </div>
    </>
  );
};

export default Header;