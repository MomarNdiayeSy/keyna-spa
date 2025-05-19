import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../contexts/AuthContext';

const Header = ({ onHeightChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const headerRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateHeight = () => {
            const headerHeight = headerRef.current ? headerRef.current.getBoundingClientRect().height : 0;
            const mobileMenuHeight = isMenuOpen && mobileMenuRef.current ? mobileMenuRef.current.getBoundingClientRect().height : 0;
            const totalHeight = headerHeight + mobileMenuHeight;
            onHeightChange(totalHeight || 64); // Hauteur minimale par défaut (4rem)
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        const observer = new MutationObserver(updateHeight);
        if (mobileMenuRef.current) {
            observer.observe(mobileMenuRef.current, { attributes: true, childList: true, subtree: true });
        }
        return () => {
            window.removeEventListener('resize', updateHeight);
            observer.disconnect();
        };
    }, [isMenuOpen, isScrolled, onHeightChange]);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/login');
    };

    return (
        <header
            ref={headerRef}
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white py-2' : 'bg-primary py-4'}`}
            style={{ top: 0 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link to={user && user.role === 'admin' ? '/admin' : '/'} className="flex items-center">
                        <img src={logo} alt="KEYNA SPA" className="h-12 w-auto" />
                        <span
                            className={`ml-2 text-xl font-semibold ${
                                isScrolled ? 'text-primary' : 'text-white'
                            }`}
                        >
                            KEYNA SPA
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLinks isScrolled={isScrolled} user={user} handleLogout={handleLogout} />
                    </nav>

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

            {isMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="md:hidden absolute top-full left-0 w-full bg-white py-4 px-6 z-50"
                >
                    <div className="flex flex-col space-y-4">
                        <MobileNavLinks
                            user={user}
                            closeMenu={closeMenu}
                            handleLogout={handleLogout}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

const NavLinks = ({ isScrolled, user, handleLogout }) => {
    const textColor = isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200';

    return (
        <>
            {user && user.role === 'admin' ? (
                <>
                    <Link to="/admin" className={textColor}>Dashboard</Link>
                    <Link to="/admin/services" className={textColor}>Services</Link>
                    <Link to="/admin/products" className={textColor}>Produits</Link>
                    <Link to="/admin/bookings" className={textColor}>Réservations</Link>
                    <Link to="/admin/users" className={textColor}>Utilisateurs</Link>
                    <Link to="/admin/statistics" className={textColor}>Statistiques</Link>
                    <Link to="/admin/vip" className={textColor}>Offres VIP</Link>
                </>
            ) : (
                <>
                    <Link to="/" className={textColor}>Accueil</Link>
                    <Link to="/services" className={textColor}>Services</Link>
                    <Link to="/shop" className={textColor}>Boutique</Link>
                    <Link to="/vip" className={textColor}>Espace VIP</Link>
                    <Link to="/contact" className={textColor}>Contact</Link>
                </>
            )}
            <div className="flex items-center space-x-4">
                {(!user || user.role === 'customer') && (
                    <Link
                        to="/cart"
                        className={`p-2 rounded-full ${
                            isScrolled ? 'text-primary hover:bg-gray-100' : 'text-white hover:bg-white/20'
                        }`}
                    >
                        <FiShoppingCart className="text-xl" />
                    </Link>
                )}
                {user ? (
                    <button
                        onClick={handleLogout}
                        className={`p-2 rounded-full ${
                            isScrolled ? 'text-red-500 hover:bg-gray-100' : 'text-white hover:bg-white/20'
                        }`}
                    >
                        <FiLogOut className="text-xl" />
                    </button>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className={`p-2 rounded-full ${
                                isScrolled ? 'text-primary hover:bg-gray-100' : 'text-white hover:bg-white/20'
                            }`}
                        >
                            <FiUser className="text-xl" />
                        </Link>
                        <Link
                            to="/register"
                            className={`text-sm ${
                                isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'
                            }`}
                        >
                            Inscription
                        </Link>
                    </>
                )}
                {(!user || user.role === 'customer') && (
                    <Link
                        to="/booking"
                        className={`px-5 py-2 rounded-full ${
                            isScrolled
                                ? 'bg-primary text-white hover:bg-primary/90'
                                : 'bg-white text-primary hover:bg-gray-100'
                        }`}
                    >
                        Réserver
                    </Link>
                )}
            </div>
        </>
    );
};

const MobileNavLinks = ({ user, closeMenu, handleLogout }) => {
    return (
        <>
            {user && user.role === 'admin' ? (
                <>
                    <Link to="/admin" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
                        Dashboard
                    </Link>
                    <Link to="/admin/services" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
                        Services
                    </Link>
                    <Link to="/admin/products" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
                        Produits
                    </Link>
                    <Link to="/admin/bookings" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
                        Réservations
                    </Link>
                    <Link to="/admin/users" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
                        Utilisateurs
                    </Link>
                    <Link to="/admin/statistics" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
                        Statistiques
                    </Link>
                    <Link to="/admin/vip" className="text-gray-800 hover:text-primary py-2" onClick={closeMenu}>
                        Offres VIP
                    </Link>
                </>
            ) : (
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
                </>
            )}
            <div className="flex items-center justify-between py-2">
                {(!user || user.role === 'customer') && (
                    <Link
                        to="/cart"
                        className="text-gray-800 hover:text-primary flex items-center"
                        onClick={closeMenu}
                    >
                        <FiShoppingCart className="mr-2" /> Panier
                    </Link>
                )}
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="text-gray-800 hover:text-red-500 flex items-center"
                    >
                        <FiLogOut className="mr-2" /> Déconnexion
                    </button>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-gray-800 hover:text-primary flex items-center"
                            onClick={closeMenu}
                        >
                            <FiUser className="mr-2" /> Connexion
                        </Link>
                        <Link
                            to="/register"
                            className="text-gray-800 hover:text-primary flex items-center"
                            onClick={closeMenu}
                        >
                            Inscription
                        </Link>
                    </>
                )}
            </div>
            {(!user || user.role === 'customer') && (
                <div className="pt-4 border-t border-gray-200">
                    <Link
                        to="/booking"
                        className="block w-full text-center px-5 py-2 rounded-full bg-primary text-white"
                        onClick={closeMenu}
                    >
                        Réserver
                    </Link>
                </div>
            )}
        </>
    );
};

export default Header;