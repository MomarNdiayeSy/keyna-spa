import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiChevronDown } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';

const Navbar = ({ onHeightChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const navbarRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const moreMenuRef = useRef(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateHeight = () => {
            const navbarHeight = navbarRef.current ? navbarRef.current.getBoundingClientRect().height : 0;
            const mobileMenuHeight = isMenuOpen && mobileMenuRef.current ? mobileMenuRef.current.getBoundingClientRect().height : 0;
            const totalHeight = navbarHeight + mobileMenuHeight;
            onHeightChange(totalHeight || 64);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !navbarRef.current.contains(event.target)
            ) {
                closeMenu();
            }
            if (
                isMoreOpen &&
                moreMenuRef.current &&
                !moreMenuRef.current.contains(event.target) &&
                !event.target.closest('button')
            ) {
                setIsMoreOpen(false);
            }
            if (
                isUserOpen &&
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target) &&
                !event.target.closest('button')
            ) {
                setIsUserOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen, isMoreOpen, isUserOpen]);

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsMoreOpen(false);
        setIsUserOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/login');
    };

    const toggleMoreMenu = () => {
        setIsMoreOpen(!isMoreOpen);
        setIsUserOpen(false);
    };

    const toggleUserMenu = () => {
        setIsUserOpen(!isUserOpen);
        setIsMoreOpen(false);
    };

    return (
        <nav
            ref={navbarRef}
            className={`fixed w-full z-50 transition-all duration-300 font-sans ${
                isScrolled ? 'bg-white py-2 shadow-soft' : 'bg-primary py-4'
            }`}
            style={{ top: 0 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link to={user && user.role === 'admin' ? '/admin' : '/'} className="flex items-center">
                        <img src={logo} alt="KEYNA SPA" className="h-12 w-auto" />
                        <span
                            className={`ml-2 text-xl font-serif font-semibold ${
                                isScrolled ? 'text-neutral-dark' : 'text-white'
                            }`}
                        >
                            KEYNA SPA
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <NavLinks
                            isScrolled={isScrolled}
                            user={user}
                            handleLogout={handleLogout}
                            cartCount={cartCount}
                            isMoreOpen={isMoreOpen}
                            toggleMoreMenu={toggleMoreMenu}
                            isUserOpen={isUserOpen}
                            toggleUserMenu={toggleUserMenu}
                            moreMenuRef={moreMenuRef}
                            userMenuRef={userMenuRef}
                        />
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
                    className={`md:hidden absolute top-full left-0 w-full bg-white py-4 px-6 z-50 shadow-soft mobile-menu ${
                        isMenuOpen ? 'open' : ''
                    }`}
                >
                    <div className="flex flex-col space-y-4">
                        <MobileNavLinks
                            user={user}
                            closeMenu={closeMenu}
                            handleLogout={handleLogout}
                            cartCount={cartCount}
                            isMoreOpen={isMoreOpen}
                            toggleMoreMenu={toggleMoreMenu}
                            isUserOpen={isUserOpen}
                            toggleUserMenu={toggleUserMenu}
                        />
                    </div>
                </div>
            )}
        </nav>
    );
};

const NavLinks = ({
    isScrolled,
    user,
    handleLogout,
    cartCount,
    isMoreOpen,
    toggleMoreMenu,
    isUserOpen,
    toggleUserMenu,
    moreMenuRef,
    userMenuRef,
}) => {
    const textColor = isScrolled ? 'text-neutral-dark hover:text-primary' : 'text-white hover:text-primary-light';

    return (
        <>
            {user && user.role === 'admin' ? (
                <>
                    <Link to="/admin" className={textColor}>
                        Dashboard
                    </Link>
                    <Link to="/admin/services" className={textColor}>
                        Services
                    </Link>
                    <Link to="/admin/products" className={textColor}>
                        Produits
                    </Link>
                    <div className="relative" ref={moreMenuRef}>
                        <button
                            className={`flex items-center ${textColor}`}
                            onClick={toggleMoreMenu}
                            aria-label="Ouvrir le menu Plus"
                        >
                            Plus{' '}
                            <FiChevronDown
                                className={`ml-1 transform transition-transform duration-300 ${
                                    isMoreOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {isMoreOpen && (
                            <div
                                className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-soft py-2 z-50 dropdown-menu ${
                                    isMoreOpen ? 'open' : ''
                                }`}
                            >
                                <Link
                                    to="/admin/bookings"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Réservations
                                </Link>
                                <Link
                                    to="/admin/users"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Utilisateurs
                                </Link>
                                <Link
                                    to="/admin/statistics"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Statistiques
                                </Link>
                                <Link
                                    to="/admin/vip"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Offres VIP
                                </Link>
                                <Link
                                    to="/admin/discounts"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Codes Promo
                                </Link>
                                <Link
                                    to="/admin/pricing"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Grille Tarifaire
                                </Link>
                                <Link
                                    to="/admin/schedules"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Créneaux Horaires
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <Link to="/" className={textColor}>
                        Accueil
                    </Link>
                    <Link to="/services" className={textColor}>
                        Services
                    </Link>
                    <Link to="/shop" className={textColor}>
                        Boutique
                    </Link>
                    <Link to="/pricing" className={textColor}>
                        Tarifs
                    </Link>
                    <div className="relative" ref={moreMenuRef}>
                        <button
                            className={`flex items-center ${textColor}`}
                            onClick={toggleMoreMenu}
                            aria-label="Ouvrir le menu Plus"
                        >
                            Plus{' '}
                            <FiChevronDown
                                className={`ml-1 transform transition-transform duration-300 ${
                                    isMoreOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {isMoreOpen && (
                            <div
                                className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-soft py-2 z-50 dropdown-menu ${
                                    isMoreOpen ? 'open' : ''
                                }`}
                            >
                                <Link
                                    to="/vip"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Espace VIP
                                </Link>
                                <Link
                                    to="/contact"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Contact
                                </Link>
                                <Link
                                    to="/history"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Historique
                                </Link>
                                <Link
                                    to="/booking"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleMoreMenu}
                                >
                                    Réserver
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
            <div className="flex items-center space-x-4">
                {(!user || user.role === 'customer') && (
                    <Link
                        to="/cart"
                        className={`p-2 rounded-full relative ${
                            isScrolled ? 'text-primary hover:bg-neutral/20' : 'text-white hover:bg-white/20'
                        }`}
                    >
                        <FiShoppingCart className="text-xl" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-2 -translate-y-2">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                )}
                {user ? (
                    <div className="relative" ref={userMenuRef}>
                        <button
                            className={`flex items-center ${isScrolled ? 'text-neutral-dark' : 'text-white'}`}
                            onClick={toggleUserMenu}
                            aria-label="Ouvrir le menu utilisateur"
                        >
                            {user.name}{' '}
                            <FiChevronDown
                                className={`ml-1 transform transition-transform duration-300 ${
                                    isUserOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {isUserOpen && (
                            <div
                                className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-soft py-2 z-50 dropdown-menu ${
                                    isUserOpen ? 'open' : ''
                                }`}
                            >
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                    onClick={toggleUserMenu}
                                >
                                    Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-neutral-dark hover:bg-primary hover:text-white"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className={`p-2 rounded-full ${
                            isScrolled ? 'text-primary hover:bg-neutral/20' : 'text-white hover:bg-white/20'
                        }`}
                    >
                        <FiUser className="text-xl" />
                    </Link>
                )}
            </div>
        </>
    );
};

const MobileNavLinks = ({
    user,
    closeMenu,
    handleLogout,
    cartCount,
    isMoreOpen,
    toggleMoreMenu,
    isUserOpen,
    toggleUserMenu,
}) => {
    return (
        <>
            {user && user.role === 'admin' ? (
                <>
                    <Link
                        to="/admin"
                        className="text-neutral-dark hover:text-primary py-2"
                        onClick={closeMenu}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/services"
                        className="text-neutral-dark hover:text-primary py-2"
                        onClick={closeMenu}
                    >
                        Services
                    </Link>
                    <Link
                        to="/admin/products"
                        className="text-neutral-dark hover:text-primary py-2"
                        onClick={closeMenu}
                    >
                        Produits
                    </Link>
                    <div className="py-2">
                        <button
                            className="text-neutral-dark hover:text-primary flex items-center"
                            onClick={toggleMoreMenu}
                            aria-label="Ouvrir le menu Plus"
                        >
                            Plus{' '}
                            <FiChevronDown
                                className={`ml-1 transform transition-transform duration-300 ${
                                    isMoreOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {isMoreOpen && (
                            <div className="pl-4 mt-2 space-y-2">
                                <Link
                                    to="/admin/bookings"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Réservations
                                </Link>
                                <Link
                                    to="/admin/users"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Utilisateurs
                                </Link>
                                <Link
                                    to="/admin/statistics"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Statistiques
                                </Link>
                                <Link
                                    to="/admin/vip"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Offres VIP
                                </Link>
                                <Link
                                    to="/admin/discounts"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Codes Promo
                                </Link>
                                <Link
                                    to="/admin/pricing"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Grille Tarifaire
                                </Link>
                                <Link
                                    to="/admin/schedules"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Créneaux Horaires
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <Link to="/" className="text-neutral-dark hover:text-primary py-2" onClick={closeMenu}>
                        Accueil
                    </Link>
                    <Link
                        to="/services"
                        className="text-neutral-dark hover:text-primary py-2"
                        onClick={closeMenu}
                    >
                        Services
                    </Link>
                    <Link to="/shop" className="text-neutral-dark hover:text-primary py-2" onClick={closeMenu}>
                        Boutique
                    </Link>
                    <Link
                        to="/pricing"
                        className="text-neutral-dark hover:text-primary py-2"
                        onClick={closeMenu}
                    >
                        Tarifs
                    </Link>
                    <div className="py-2">
                        <button
                            className="text-neutral-dark hover:text-primary flex items-center"
                            onClick={toggleMoreMenu}
                            aria-label="Ouvrir le menu Plus"
                        >
                            Plus{' '}
                            <FiChevronDown
                                className={`ml-1 transform transition-transform duration-300 ${
                                    isMoreOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {isMoreOpen && (
                            <div className="pl-4 mt-2 space-y-2">
                                <Link
                                    to="/vip"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Espace VIP
                                </Link>
                                <Link
                                    to="/contact"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Contact
                                </Link>
                                <Link
                                    to="/history"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Historique
                                </Link>
                                <Link
                                    to="/booking"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Réserver
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
            <div className="flex flex-col space-y-2 py-2 border-t border-neutral/20">
                {(!user || user.role === 'customer') && (
                    <Link
                        to="/cart"
                        className="text-neutral-dark hover:text-primary flex items-center relative"
                        onClick={closeMenu}
                    >
                        <FiShoppingCart className="mr-2" /> Panier
                        {cartCount > 0 && (
                            <span className="absolute top-0 left-4 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform -translate-y-2">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                )}
                {user ? (
                    <div>
                        <button
                            className="text-neutral-dark hover:text-primary flex items-center"
                            onClick={toggleUserMenu}
                            aria-label="Ouvrir le menu utilisateur"
                        >
                            {user.name}{' '}
                            <FiChevronDown
                                className={`ml-1 transform transition-transform duration-300 ${
                                    isUserOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {isUserOpen && (
                            <div className="pl-4 mt-2 space-y-2">
                                <Link
                                    to="/profile"
                                    className="block text-neutral-dark hover:text-primary"
                                    onClick={closeMenu}
                                >
                                    Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block text-neutral-dark hover:text-red-500"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="text-neutral-dark hover:text-primary flex items-center"
                        onClick={closeMenu}
                    >
                        <FiUser className="mr-2" /> Connexion
                    </Link>
                )}
            </div>
        </>
    );
};

export default Navbar;