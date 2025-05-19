const pool = require('../config/db');

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM products');
        const formattedProducts = products.rows.map((product) => ({
            ...product,
            price: parseFloat(product.price),
        }));
        res.json(formattedProducts);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un produit (pour admin)
exports.createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newProduct = await pool.query(
            'INSERT INTO products (name, description, price, image, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
            [name, description, price, image]
        );
        res.status(201).json({
            ...newProduct.rows[0],
            price: parseFloat(newProduct.rows[0].price),
        });
    } catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Modifier un produit (pour admin)
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    try {
        const updatedProduct = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, image = $4 WHERE id = $5 RETURNING *',
            [name, description, price, image, productId]
        );
        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé.' });
        }
        res.json({
            ...updatedProduct.rows[0],
            price: parseFloat(updatedProduct.rows[0].price),
        });
    } catch (error) {
        console.error('Erreur lors de la modification du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un produit (pour admin)
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);
        if (deletedProduct.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé.' });
        }
        res.json({ message: 'Produit supprimé.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};