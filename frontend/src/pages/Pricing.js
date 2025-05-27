import React, { useState, useEffect } from 'react';
import { pricingService } from '../services/pricingService';

const Pricing = () => {
    const [pricingData, setPricingData] = useState({ services: [], formulas: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [servicesCurrentPage, setServicesCurrentPage] = useState(1);
    const [formulasCurrentPage, setFormulasCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const data = await pricingService.getPricing();
                setPricingData(data);
                setLoading(false);
            } catch (error) {
                setError('Erreur lors de la récupération des tarifs.');
                console.error(error);
                setLoading(false);
            }
        };
        fetchPricing();
    }, []);

    // Fonctions de pagination pour les services
    const handleServicesPageChange = (pageNumber) => {
        setServicesCurrentPage(pageNumber);
        // Scroll vers la section services
        document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fonctions de pagination pour les formules
    const handleFormulasPageChange = (pageNumber) => {
        setFormulasCurrentPage(pageNumber);
        // Scroll vers la section formules
        document.getElementById('formulas-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Composant de pagination réutilisable
    const PaginationComponent = ({ currentPage, totalItems, onPageChange, idPrefix }) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (totalPages <= 1) return null;

        const getPageNumbers = () => {
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        };

        return (
            <div className="flex justify-center items-center mt-8 space-x-2">
                {/* Bouton Précédent */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg border font-sans ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-neutral-dark hover:bg-gray-50 border-gray-300'
                    }`}
                >
                    Précédent
                </button>

                {/* Numéros de pages */}
                {getPageNumbers().map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg border font-sans ${
                            currentPage === pageNumber
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-neutral-dark hover:bg-gray-50 border-gray-300'
                        }`}
                    >
                        {pageNumber}
                    </button>
                ))}

                {/* Bouton Suivant */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg border font-sans ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-neutral-dark hover:bg-gray-50 border-gray-300'
                    }`}
                >
                    Suivant
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-neutral py-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-sans text-neutral-dark">Chargement de la grille tarifaire...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-neutral py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-serif font-bold text-neutral-dark mb-8 text-center">Grille Tarifaire</h2>
                    <div className="max-w-2xl mx-auto bg-red-50 border-l-8 border-red-500 text-red-700 p-6 rounded-xl shadow-soft flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-sans">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    const groupedServices = pricingData.services.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {});

    // Pagination pour les services (par catégorie)
    const serviceCategories = Object.entries(groupedServices);
    //const servicesTotalPages = Math.ceil(serviceCategories.length / itemsPerPage);
    const servicesStartIndex = (servicesCurrentPage - 1) * itemsPerPage;
    const servicesEndIndex = servicesStartIndex + itemsPerPage;
    const currentServiceCategories = serviceCategories.slice(servicesStartIndex, servicesEndIndex);

    // Pagination pour les formules
    //const formulasTotalPages = Math.ceil(pricingData.formulas.length / itemsPerPage);
    const formulasStartIndex = (formulasCurrentPage - 1) * itemsPerPage;
    const formulasEndIndex = formulasStartIndex + itemsPerPage;
    const currentFormulas = pricingData.formulas.slice(formulasStartIndex, formulasEndIndex);

    return (
        <section className="min-h-screen bg-neutral py-16">
            <div className="container mx-auto px-4">
                {/* En-tête */}
                <div className="text-center mb-12 animate-[fadeIn_1s_ease-out]">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-dark mb-4">Grille Tarifaire</h2>
                    <p className="text-lg font-sans text-neutral-dark/80 max-w-2xl mx-auto">
                        Découvrez nos soins d'exception et formules exclusives pour une expérience de bien-être inégalée.
                    </p>
                    <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
                </div>

                <div className="space-y-16">
                    {/* Services */}
                    <div id="services-section" className="animate-[fadeInUp_1s_ease-out]">
                        <h3 className="text-3xl font-serif font-semibold text-neutral-dark mb-8 text-center">Nos Services</h3>
                        
                        {/* Informations de pagination pour les services */}
                        {serviceCategories.length > 0 && (
                            <div className="text-center text-neutral-dark/70 mb-6 font-sans">
                                Affichage de {servicesStartIndex + 1} à {Math.min(servicesEndIndex, serviceCategories.length)} sur {serviceCategories.length} catégories
                            </div>
                        )}

                        {Object.keys(groupedServices).length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-soft text-center max-w-2xl mx-auto">
                                <p className="text-lg font-sans text-neutral-dark/70">
                                    Aucun service disponible pour le moment.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-12">
                                    {currentServiceCategories.map(([category, items]) => (
                                        <div key={category} className="space-y-6">
                                            <h4 className="text-2xl font-serif font-semibold text-neutral-dark">{category}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-white p-6 rounded-xl shadow-soft hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                                    >
                                                        <h5 className="text-lg font-sans font-semibold text-neutral-dark mb-2">
                                                            {item.name}
                                                        </h5>
                                                        {item.duration && (
                                                            <p className="text-sm font-sans text-neutral-dark/70">
                                                                Durée : {item.duration} min
                                                            </p>
                                                        )}
                                                        {item.description && (
                                                            <p className="text-sm font-sans text-neutral-dark/70 mt-1">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        <p className="text-accent font-sans font-semibold text-lg mt-3">
                                                            {parseFloat(item.price_solo).toFixed(2)} FCFA
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination des services */}
                                <PaginationComponent
                                    currentPage={servicesCurrentPage}
                                    totalItems={serviceCategories.length}
                                    onPageChange={handleServicesPageChange}
                                    idPrefix="services"
                                />
                            </>
                        )}
                    </div>

                    {/* Formules */}
                    <div id="formulas-section" className="animate-[fadeInUp_1s_ease-out]">
                        <h3 className="text-3xl font-serif font-semibold text-neutral-dark mb-8 text-center">Nos Formules</h3>
                        
                        {/* Informations de pagination pour les formules */}
                        {pricingData.formulas.length > 0 && (
                            <div className="text-center text-neutral-dark/70 mb-6 font-sans">
                                Affichage de {formulasStartIndex + 1} à {Math.min(formulasEndIndex, pricingData.formulas.length)} sur {pricingData.formulas.length} formules
                            </div>
                        )}

                        {pricingData.formulas.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-soft text-center max-w-2xl mx-auto">
                                <p className="text-lg font-sans text-neutral-dark/70">
                                    Aucune formule disponible pour le moment.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {currentFormulas.map((item) => (
                                        <div
                                            key={item.id}
                                            className="relative bg-white p-8 rounded-xl shadow-soft hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                        >
                                            {/* Badge Premium */}
                                            <span className="absolute top-0 right-0 bg-primary text-white text-xs font-sans font-semibold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                                Premium
                                            </span>
                                            <h4 className="text-xl font-serif font-semibold text-neutral-dark mb-3">
                                                {item.name}
                                            </h4>
                                            {item.description && (
                                                <p className="text-sm font-sans text-neutral-dark/70 mb-2">
                                                    {item.description}
                                                </p>
                                            )}
                                            {item.included_services && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-sans text-neutral-dark/70 font-semibold">
                                                        Inclut :
                                                    </p>
                                                    <ul className="list-disc list-inside text-sm font-sans text-neutral-dark/70">
                                                        {item.included_services.split(',').map((service, index) => (
                                                            <li key={index}>{service.trim()}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <p className="text-accent font-sans font-semibold">
                                                    Solo : {parseFloat(item.price_solo).toFixed(2)} FCFA
                                                </p>
                                                {item.price_duo && (
                                                    <p className="text-accent font-sans font-semibold">
                                                        Duo : {parseFloat(item.price_duo).toFixed(2)} FCFA
                                                    </p>
                                                )}
                                                {item.price_package && (
                                                    <p className="text-accent font-sans font-semibold">
                                                        Forfait : {parseFloat(item.price_package).toFixed(2)} FCFA
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination des formules */}
                                <PaginationComponent
                                    currentPage={formulasCurrentPage}
                                    totalItems={pricingData.formulas.length}
                                    onPageChange={handleFormulasPageChange}
                                    idPrefix="formulas"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;