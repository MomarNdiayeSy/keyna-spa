import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Sophie Martin',
            text: 'Une expérience incroyable au KEYNA SPA. Le massage relaxant était parfait !',
        },
        {
            name: 'Luc Dupont',
            text: 'Les produits de la boutique sont de grande qualité. Je recommande le kit spa maison.',
        },
    ];

    return (
        <section className="section bg-white">
            <div className="container">
                <h2 className="section-title">Avis de nos Clients</h2>
                <p className="section-subtitle">Ce que nos clients disent de nous.</p>
                <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="card p-4">
                            <p className="text-gray-600 italic">"{testimonial.text}"</p>
                            <p className="text-primary font-semibold mt-2">- {testimonial.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;