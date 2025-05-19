import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { CartContext } from '../contexts/CartContext';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { cartCount } = useContext(CartContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (err) {
                console.error('Erreur de décodage du token:', err);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-lg fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-serif font-bold">KEYNA SPA</Link>
                <div className="flex space-x-4 items-center">
                    <Link to="/shop" className="hover:text-primary">Boutique</Link>
                    <Link to="/vip" className="hover:text-primary">Espace VIP</Link>
                    <Link to="/cart" className="hover:text-primary relative">
                        Panier
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-4 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/testimonials" className="hover:text-primary">Témoignages</Link>
                    <Link to="/privacy" className="hover:text-primary">Confidentialité</Link>
                    <Link to="/terms" className="hover:text-primary">Conditions</Link>
                    {user && user.role === 'admin' && (
                        <>
                            <Link to="/admin" className="hover:text-primary">Admin</Link>
                            <Link to="/admin/users" className="hover:text-primary">Utilisateurs</Link>
                            <Link to="/admin/services" className="hover:text-primary">Services</Link>
                            <Link to="/admin/products" className="hover:text-primary">Produits</Link>
                            <Link to="/admin/bookings" className="hover:text-primary">Réservations</Link>
                            <Link to="/admin/statistics" className="hover:text-primary">Statistiques</Link>
                        </>
                    )}
                    {user ? (
                        <>
                            <span>Bienvenue, {user.name}</span>
                            <button onClick={handleLogout} className="hover:text-primary">Déconnexion</button>
                        </>
                    ) : (
                        <Link to="/login" className="hover:text-primary">Connexion</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;