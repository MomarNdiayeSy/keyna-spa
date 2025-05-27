import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 3; // Nombre de services par page

    useEffect(() => {
        axios.get('http://localhost:5000/api/services')
            .then((response) => {
                setServices(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des services:', error);
                setError('Impossible de charger les services. Veuillez réessayer plus tard.');
                setLoading(false);
            });
    }, []);

    // Calculs pour la pagination
    const totalPages = Math.ceil(services.length / servicesPerPage);
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    const currentServices = services.slice(startIndex, endIndex);

    // Fonction pour changer de page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll vers le haut de la section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Générer les numéros de pages à afficher
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-neutral py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold mb-4 text-primary-dark">Nos Services</h2>
                    <p className="text-center text-secondary-dark">Chargement des services...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-neutral py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold mb-4 text-primary-dark">Nos Services</h2>
                    <p className="text-center text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-neutral py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-4 text-primary-dark">Nos Services</h2>
                <p className="text-body text-secondary-dark mb-8">
                    Découvrez nos soins conçus pour votre bien-être. Chaque service est pensé pour offrir une expérience relaxante et revitalisante.
                </p>

                {/* Informations de pagination */}
                {/* {services.length > 0 && (
                    <div className="mb-6 text-center">
                        <p className="text-secondary-dark">
                            Affichage de {startIndex + 1} à {Math.min(endIndex, services.length)} sur {services.length} services
                        </p>
                    </div>
                )} */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {Array.isArray(currentServices) && currentServices.length > 0 ? (
                        currentServices.map((service) => (
                            <div key={service.id} className="bg-white rounded-xl shadow-soft group hover:shadow-lg transition-shadow">
                                <div className="relative h-64 overflow-hidden rounded-t-xl">
                                    {service.image ? (
                                        <img
                                            src={`http://localhost:5000${service.image}`}
                                            alt={service.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-light flex items-center justify-center">
                                            <span className="text-secondary-dark">Aucune image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <h3 className="absolute bottom-4 left-4 text-xl font-serif text-white">{service.name}</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-body text-secondary-dark mb-4 line-clamp-3">{service.description}</p>
                                    <Link
                                        to={`/service-details/${service.id}`}
                                        className="btn bg-accent text-white w-full text-center py-2 rounded-xl hover:bg-accent-dark"
                                    >
                                        Voir plus
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <p className="text-center text-secondary-dark">Aucun service disponible.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        {/* Bouton Précédent */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentPage === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-primary-dark hover:bg-accent hover:text-white border border-primary-light'
                            }`}
                        >
                            Précédent
                        </button>

                        {/* Numéros de pages */}
                        {getPageNumbers().map((pageNumber, index) => (
                            <React.Fragment key={index}>
                                {pageNumber === '...' ? (
                                    <span className="px-3 py-2 text-secondary-dark">...</span>
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            currentPage === pageNumber
                                                ? 'bg-accent text-white'
                                                : 'bg-white text-primary-dark hover:bg-accent hover:text-white border border-primary-light'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Bouton Suivant */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-primary-dark hover:bg-accent hover:text-white border border-primary-light'
                            }`}
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Services;