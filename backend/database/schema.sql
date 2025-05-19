-- Suppression des tables si elles existent
DROP TABLE IF EXISTS vip_offers;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS products;

-- Création de la table users
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR NOT NULL,
                       email VARCHAR NOT NULL UNIQUE,
                       password VARCHAR NOT NULL,
                       role VARCHAR NOT NULL DEFAULT 'customer', -- customer ou admin
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table services
CREATE TABLE services (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR NOT NULL,
                          description TEXT,
                          price NUMERIC(10,2) NOT NULL,
                          duration VARCHAR NOT NULL,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table products
CREATE TABLE products (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR NOT NULL,
                          description TEXT,
                          price NUMERIC(10,2) NOT NULL,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table bookings
CREATE TABLE bookings (
                          id SERIAL PRIMARY KEY,
                          service_id INTEGER NOT NULL REFERENCES services(id),
                          booking_date DATE NOT NULL,
                          booking_time TIME NOT NULL,
                          customer_name VARCHAR NOT NULL,
                          customer_email VARCHAR NOT NULL,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table cart
CREATE TABLE cart (
                      id SERIAL PRIMARY KEY,
                      user_id INTEGER NOT NULL REFERENCES users(id),
                      product_id INTEGER NOT NULL REFERENCES products(id),
                      quantity INTEGER NOT NULL DEFAULT 1,
                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table vip_offers
CREATE TABLE vip_offers (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR NOT NULL,
                            description TEXT,
                            price NUMERIC(10,2) NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des données initiales pour users
INSERT INTO users (name, email, password, role) VALUES
                                                    ('Admin User', 'admin@keynaspa.com', '$2b$10$exampleHashedPassword', 'admin'),
                                                    ('Test Customer', 'customer@keynaspa.com', '$2b$10$exampleHashedPassword', 'customer');

-- Insertion des données initiales pour services
INSERT INTO services (name, description, price, duration) VALUES
                                                              ('Massage Relaxant', 'Un massage doux pour relâcher les tensions.', 50.00, '60 min'),
                                                              ('Soin Visage Hydratant', 'Un soin pour hydrater et revitaliser la peau.', 40.00, '45 min'),
                                                              ('Gommage Corporel', 'Exfoliation pour une peau douce et lumineuse.', 35.00, '30 min'),
                                                              ('Spa Complet', 'Combinaison de massage, soin visage et gommage.', 100.00, '120 min');

-- Insertion des données initiales pour products
INSERT INTO products (name, description, price) VALUES
                                                    ('Huile de Massage Bio', 'Huile relaxante à base d’ingrédients naturels.', 25.00),
                                                    ('Crème Hydratante', 'Crème pour une peau douce et hydratée.', 20.00),
                                                    ('Bougie Parfumée', 'Bougie pour une ambiance apaisante.', 15.00),
                                                    ('Kit Spa Maison', 'Ensemble pour recréer l’expérience spa chez soi.', 50.00);

-- Insertion des données initiales pour vip_offers
INSERT INTO vip_offers (name, description, price) VALUES
                                                      ('Spa VIP Exclusif', 'Un forfait spa privé avec champagne.', 200.00),
                                                      ('Massage VIP', 'Massage personnalisé avec huiles rares.', 120.00);