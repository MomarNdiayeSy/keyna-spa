// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiShoppingBag, FiAward, FiUsers } from 'react-icons/fi';

// Importez les images (à remplacer par vos propres images)
import heroImage from '../assets/hero-bg.jpg'; // Image de fond du hero
import service1Image from '../assets/service1.jpg';
import service2Image from '../assets/service2.jpg';
import service3Image from '../assets/service3.jpg';
import testimonialImage from '../assets/testimonial.jpg';
import keynaSpaLogo from '../assets/keyna-spa-logo.png'; // Nouveau logo

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        className="hero-section bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 h-screen flex flex-col justify-center">
          <div className="max-w-2xl animate-fadeIn">
            <img
                src={keynaSpaLogo}
                alt="KEYNA SPA Logo"
                className="h-16 md:h-20 mb-6" // Taille ajustable
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
              Découvrez l'Art du Bien-Être
            </h1>
            <p className="text-xl text-white mb-8">
              KEYNA SPA vous offre une expérience unique de relaxation et de soins dans un cadre luxueux et apaisant.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking" className="btn btn-primary">
                Réserver Maintenant
              </Link>
              <Link to="/services" className="btn bg-white text-primary hover:bg-gray-100">
                Nos Services
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,176C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="section-title">Nos Services Premium</h2>
          <p className="section-subtitle">
            Découvrez notre sélection de soins et de traitements conçus pour vous offrir une expérience de bien-être complète.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Service 1 */}
            <div className="card group hover:translate-y-[-5px]">
              <div className="relative h-64 overflow-hidden">
                <img src={service1Image} alt="Massage Relaxant" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-serif text-white">Massages Relaxants</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Nos massages thérapeutiques vous aident à vous détendre et à revitaliser votre corps et votre esprit.
                </p>
                <Link to="/services#massages" className="text-primary font-medium hover:text-primary-dark">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="card group hover:translate-y-[-5px]">
              <div className="relative h-64 overflow-hidden">
                <img src={service2Image} alt="Soins du Visage" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-serif text-white">Soins du Visage</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Des traitements personnalisés pour une peau éclatante, utilisant des produits de qualité supérieure.
                </p>
                <Link to="/services#facial" className="text-primary font-medium hover:text-primary-dark">
                  En savoir plus →
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="card group hover:translate-y-[-5px]">
              <div className="relative h-64 overflow-hidden">
                <img src={service3Image} alt="Spa & Hammam" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-serif text-white">Spa & Hammam</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Profitez de nos installations de spa et de hammam pour une expérience de détente complète.
                </p>
                <Link to="/services#spa" className="text-primary font-medium hover:text-primary-dark">
                  En savoir plus →
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn btn-outline">
              Voir tous les services
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Bienvenue chez KEYNA SPA</h2>
              <p className="text-gray-600 mb-4">
                Fondé en 2012, KEYNA SPA est rapidement devenu une référence dans le domaine du bien-être de luxe. Notre équipe de professionnels qualifiés vous accueille dans un cadre élégant et apaisant, conçu pour vous offrir une expérience unique.
              </p>
              <p className="text-gray-600 mb-6">
                Nos valeurs reposent sur l'excellence du service, l'utilisation de produits naturels de haute qualité et une attention particulière portée à chaque client pour répondre à ses besoins spécifiques.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                    <FiUsers size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Personnel Expert</h4>
                    <p className="text-sm text-gray-600">Professionnels certifiés</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                    <FiAward size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Produits Premium</h4>
                    <p className="text-sm text-gray-600">Sélectionnés avec soin</p>
                  </div>
                </div>
              </div>

              <Link to="/about" className="btn btn-primary mt-8 inline-block">
                En savoir plus
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden h-40 md:h-64">
                  <img src={service1Image} alt="KEYNA SPA" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden h-40 md:h-40">
                  <img src={service2Image} alt="KEYNA SPA" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-xl overflow-hidden h-40 md:h-40">
                  <img src={service3Image} alt="KEYNA SPA" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden h-40 md:h-64">
                  <img src={testimonialImage} alt="KEYNA SPA" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Prêt à Vous Offrir un Moment de Détente ?</h2>
            <p className="text-xl mb-8 text-gray-100">
              Réservez dès maintenant votre séance et bénéficiez de notre offre de bienvenue : 15% de réduction sur votre première visite.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/booking" className="btn bg-white text-primary hover:bg-gray-100">
                <FiCalendar className="inline-block mr-2" /> Réserver un Soin
              </Link>
              <Link to="/shop" className="btn bg-accent text-white hover:bg-accent-dark">
                <FiShoppingBag className="inline-block mr-2" /> Explorer la Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="section-title">Ce Que Disent Nos Clients</h2>
          <p className="section-subtitle">
            Découvrez les témoignages de nos clients qui ont vécu l'expérience KEYNA SPA.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Testimonial 1 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-primary">
                  <span className="font-serif text-xl">S</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Sophie L.</h4>
                  <div className="flex text-accent">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Une expérience inoubliable ! Le massage aux pierres chaudes était parfait, et le personnel est d'une gentillesse remarquable. Je reviendrai très bientôt !"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-primary">
                  <span className="font-serif text-xl">M</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Marc D.</h4>
                  <div className="flex text-accent">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "J'ai offert à ma femme une journée complète au spa pour notre anniversaire de mariage. Elle en est revenue complètement métamorphosée. Un grand merci à toute l'équipe !"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-primary">
                  <span className="font-serif text-xl">L</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Laura B.</h4>
                  <div className="flex text-accent">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Les soins du visage sont exceptionnels ! Ma peau n'a jamais été aussi éclatante. Le cadre est magnifique et l'atmosphère est vraiment relaxante."
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/testimonials" className="btn btn-outline">
              Voir tous les témoignages
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Restez Informé</h2>
            <p className="text-gray-600 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos offres spéciales et actualités.
            </p>

            <form className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-grow px-4 py-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-r-full hover:bg-primary-dark transition duration-300"
              >
                S'inscrire
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              En vous inscrivant, vous acceptez de recevoir nos emails et confirmez avoir lu notre politique de confidentialité.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;