import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(64); // Hauteur initiale par défaut (4rem)

    useEffect(() => {
        const updateInitialHeight = () => {
            const initialHeight = 64; // Correspond à py-4 + h-12
            setHeaderHeight(initialHeight);
        };
        updateInitialHeight();
    }, []);

    return (
        <div className="flex flex-col min-h-screen" style={{ margin: 0, padding: 0 }}>
            <Header onHeightChange={(height) => setHeaderHeight(height)} />
            <main className="flex-grow" style={{ marginTop: `${headerHeight}px`, padding: 0 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;