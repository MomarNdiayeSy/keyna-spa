import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiShoppingBag, FiAward, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import 'animate.css';

// Importez les images (à remplacer par vos propres images)
import heroImage from '../assets/hero-bg.jpg'; // Image de fond du hero
import service1Image from '../assets/service1.jpg';
import service2Image from '../assets/service2.jpg';
import service3Image from '../assets/service3.jpg';
import testimonialImage from '../assets/testimonial.jpg';
import keynaSpaLogo from '../assets/keyna-spa-logo.png'; // Nouveau logo

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Charger les services depuis l'API
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/services')
      .then((response) => {
        const apiServices = Array.isArray(response.data)
          ? response.data.slice(0, 3) // Limiter à 3 services
          : [];
        setServices(apiServices);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des services:', error);
        setError('Impossible de charger les services. Veuillez réessayer plus tard.');
        setLoading(false);
      });
  }, []);

  // Gérer la soumission de la newsletter
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi (remplacer par une vraie requête API si nécessaire)
    setNewsletterSubmitted(true);
    setTimeout(() => setNewsletterSubmitted(false), 3000); // Réinitialiser après 3s
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero-section bg-cover bg-center relative hero-parallax min-h-screen flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center">
          <div className="max-w-3xl text-center mx-auto">
            <img
              src={keynaSpaLogo}
              alt="KEYNA SPA Logo"
              className="h-16 md:h-20 mx-auto mb-6 animate__animated animate__fadeIn animate__delay-1s"
            />
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 animate__animated animate__slideInUp animate__delay-2s"
            >
              Vivez l’Art du Bien-Être
            </h1>
            <p
              className="text-xl md:text-2xl text-white mb-8 animate__animated animate__fadeIn animate__delay-3s"
            >
              KEYNA SPA : Une oasis de luxe et de sérénité pour votre corps et votre esprit.
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate__animated animate__fadeIn animate__delay-4s">
              <Link
                to="/booking"
                className="btn bg-accent text-white hover:bg-accent-dark flex items-center px-6 py-3 rounded-xl shadow-soft"
                aria-label="Réserver une séance"
              >
                <FiCalendar className="mr-2" /> Réserver Maintenant
              </Link>
              <Link
                to="/services"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-3 rounded-xl"
                aria-label="Voir nos services"
              >
                Nos Services
              </Link>
            </div>
            <div className="mt-6 animate__animated animate__fadeIn animate__delay-5s">
              <span
                className="offer-badge inline-flex items-center justify-center px-6 py-3 rounded-full text-base text-white font-medium shadow-soft"
                aria-label="Offre limitée : 15% sur votre première visite jusqu’au 30 mai 2025"
              >
                Offre limitée : <strong className="mx-1">15% sur votre première visite</strong> jusqu’au 30 mai 2025
              </span>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#F5F5F5"
              fillOpacity="1"
              d="M0,96L48,112C48,64,96,64,144,80C192,96,192,128,240,149.3C288,171,336,171,384,160C432,149,384,128,480,128C576,128,528,149,624,160C672,171,768,171,816,160C864,149,816,128,912,112C960,96,1008,96,1056,112C1104,128,1056,160,1152,160C1200,160,1248,128,1296,112C1344,96,1392,96,1416,96C1440,96,1440,96,1440,96L1440,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="section bg-neutral py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-neutral-dark mb-4 animate__animated animate__fadeIn">
            Nos Soins d’Exception
          </h2>
          <p className="text-center text-neutral-dark/80 max-w-2xl mx-auto mb-12 animate__animated animate__fadeIn animate__delay-1s">
            Plongez dans une expérience de bien-être unique avec nos soins conçus pour revitaliser votre corps et esprit.
          </p>

          {loading ? (
            <div className="loader" aria-label="Chargement des services"></div>
          ) : error ? (
            <p className="text-center text-red-600 bg-red-50 p-4 rounded-xl">{error}</p>
          ) : Array.isArray(services) && services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="card bg-white rounded-xl shadow-soft group hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden rounded-t-xl">
                    {service.image ? (
                      <img
                        src={`http://localhost:5000${service.image}`}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral flex items-center justify-center">
                        <span className="text-neutral-dark/60">Aucune image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <h3 className="absolute bottom-4 left-4 text-xl font-serif text-white">{service.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-neutral-dark/80 mb-4 line-clamp-3">{service.description}</p>
                    <Link
                      to={`/service-details/${service.id}`}
                      className="btn btn-primary w-full flex items-center justify-center bg-accent text-white py-2 rounded-xl hover:bg-accent-dark"
                      aria-label={`Voir plus sur ${service.name}`}
                    >
                      Voir plus
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-dark/80">Aucun soin disponible pour le moment.</p>
          )}

          <div className="text-center mt-12 animate__animated animate__fadeIn animate__delay-2s">
            <Link
              to="/services"
              className="btn bg-accent text-white hover:bg-accent-dark px-6 py-3 rounded-xl"
              aria-label="Voir tous les services"
            >
              Découvrir tous nos soins
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2
                className="text-3xl md:text-4xl font-serif font-bold text-neutral-dark mb-6 animate__animated animate__fadeIn"
              >
                L’Essence de KEYNA SPA
              </h2>
              <p
                className="text-neutral-dark/80 mb-4 animate__animated animate__fadeIn animate__delay-1s"
              >
                Depuis 2012, KEYNA SPA est synonyme de luxe et de sérénité. Notre équipe d’experts vous accueille dans un cadre raffiné, dédié à votre bien-être.
              </p>
              <p
                className="text-neutral-dark/80 mb-6 animate__animated animate__fadeIn animate__delay-2s"
              >
                Chaque soin est conçu avec des produits naturels premium, pour une expérience personnalisée qui répond à vos besoins uniques.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate__animated animate__fadeIn animate__delay-3s">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <FiUsers size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-dark">Équipe d’Experts</h4>
                    <p className="text-sm text-neutral-dark/80">Certifiés et passionnés</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <FiAward size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-dark">Produits d’Excellence</h4>
                    <p className="text-sm text-neutral-dark/80">Naturels et haut de gamme</p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className="btn btn-primary mt-8 inline-block animate__animated animate__fadeIn animate__delay-4s"
                aria-label="En savoir plus sur KEYNA SPA"
              >
                En savoir plus
              </Link>
            </div>

            <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden h-40 md:h-64 animate-float">
                  <img
                    src={service1Image}
                    alt="Soin relaxant"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl overflow-hidden h-40 md:h-40 animate-float" style={{ animationDelay: '1s' }}>
                  <img
                    src={service2Image}
                    alt="Soin visage"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-xl overflow-hidden h-40 md:h-40 animate-float" style={{ animationDelay: '2s' }}>
                  <img
                    src={service3Image}
                    alt="Massage"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl overflow-hidden h-40 md:h-64 animate-float" style={{ animationDelay: '3s' }}>
                  <img
                    src={testimonialImage}
                    alt="Expérience client"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2
              className="text-3xl md:text-4xl font-serif font-bold mb-4 animate__animated animate__fadeIn"
            >
              Offrez-vous une Pause Mémorable
            </h2>
            <p
              className="text-xl mb-8 text-white/90 animate__animated animate__fadeIn animate__delay-1s"
            >
              Profitez de notre offre exclusive : <strong>15% de réduction</strong> sur votre première visite. Réservez dès maintenant !
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate__animated animate__fadeIn animate__delay-2s">
              <Link
                to="/booking"
                className="btn bg-accent text-white hover:bg-accent-dark flex items-center px-6 py-3 rounded-xl animate-pulse"
                aria-label="Réserver une séance"
              >
                <FiCalendar className="mr-2" /> Réserver un Soin
              </Link>
              <Link
                to="/shop"
                className="btn bg-white text-primary hover:bg-gray-100 flex items-center px-6 py-3 rounded-xl"
                aria-label="Explorer la boutique"
              >
                <FiShoppingBag className="mr-2" /> Explorer la Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl font-serif font-bold text-neutral-dark mb-4 animate__animated animate__fadeIn"
            >
              Rejoignez Notre Univers
            </h2>
            <p
              className="text-neutral-dark/80 mb-8 animate__animated animate__fadeIn animate__delay-1s"
            >
              Inscrivez-vous à notre newsletter pour des offres exclusives et des conseils bien-être.
            </p>

            {newsletterSubmitted ? (
              <p className="text-accent font-medium animate__animated animate__fadeIn">
                Merci pour votre inscription ! Vérifiez votre boîte de réception.
              </p>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex max-w-md mx-auto shadow-soft rounded-full overflow-hidden animate__animated animate__fadeIn animate__delay-2s"
              >
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-grow px-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                  aria-label="Adresse email pour la newsletter"
                />
                <button
                  type="submit"
                  className="bg-accent text-white px-6 py-3 hover:bg-accent-dark transition duration-300"
                  aria-label="S’inscrire à la newsletter"
                >
                  S’inscrire
                </button>
              </form>
            )}

            <p className="text-sm text-neutral-dark/60 mt-4 animate__animated animate__fadeIn animate__delay-3s">
              En vous inscrivant, vous acceptez notre{' '}
              <Link to="/privacy" className="underline hover:text-primary">
                politique de confidentialité
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;