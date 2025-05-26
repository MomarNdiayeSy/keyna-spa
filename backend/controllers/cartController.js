const pool = require('../config/db');

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
        // Vérifier si le produit existe
        const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé.' });
        }

        // Vérifier si l'article est déjà dans le panier
        const cartCheck = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        if (cartCheck.rows.length > 0) {
            // Mettre à jour la quantité
            const updatedCart = await pool.query(
                'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
                [quantity || 1, userId, productId]
            );
            return res.status(200).json(updatedCart.rows[0]);
        }

        // Ajouter un nouvel article au panier
        const newCartItem = await pool.query(
            'INSERT INTO cart (user_id, product_id, quantity, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *',
            [userId, productId, quantity || 1]
        );
        res.status(201).json(newCartItem.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l’ajout au panier:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer le panier d’un utilisateur
exports.getCart = async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
        const cartItems = await pool.query(
            'SELECT c.id, c.quantity, p.id AS product_id, p.name, p.description, p.price, p.image ' +
            'FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
            [userId]
        );
        // Convertir les prix en nombres
        const formattedItems = cartItems.rows.map((item) => ({
            ...item,
            price: parseFloat(item.price),
        }));
        res.json(formattedItems);
    } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un article du panier
exports.removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
        const deletedItem = await pool.query(
            'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
            [itemId, userId]
        );
        if (deletedItem.rows.length === 0) {
            return res.status(404).json({ error: 'Article non trouvé dans le panier.' });
        }
        res.json({ message: 'Article supprimé du panier.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’article:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour la quantité d’un article
exports.updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Quantité invalide.' });
    }

    try {
        const updatedItem = await pool.query(
            'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, itemId, userId]
        );
        if (updatedItem.rows.length === 0) {
            return res.status(404).json({ error: 'Article non trouvé dans le panier.' });
        }
        res.json(updatedItem.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};