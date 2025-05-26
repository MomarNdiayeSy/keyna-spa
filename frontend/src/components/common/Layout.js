import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(48); // Hauteur initiale réduite

    useEffect(() => {
        const updateInitialHeight = () => {
            const initialHeight = 48; // Correspond à la nouvelle hauteur
            setHeaderHeight(initialHeight);
        };
        updateInitialHeight();
    }, []);

    return (
        <div className="flex flex-col min-h-screen" style={{ margin: 0, padding: 0 }}>
            <Navbar onHeightChange={(height) => setHeaderHeight(height)} />
            <main className="flex-grow" style={{ marginTop: `${headerHeight}px`, padding: 0 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;