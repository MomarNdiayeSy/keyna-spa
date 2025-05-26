const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/db');

exports.getPaymentMethods = async (req, res) => {
    try {
        const methods = await pool.query('SELECT name, is_active FROM payment_methods');
        res.json(methods.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des méthodes de paiement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createCheckoutSession = async (req, res) => {
    const userId = req.user?.userId;
    const { discountCode } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
        // Vérifier si Stripe est actif
        const methodCheck = await pool.query(
            'SELECT * FROM payment_methods WHERE name = $1 AND is_active = TRUE',
            ['stripe']
        );
        if (methodCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Méthode de paiement non disponible.' });
        }

        // Récupérer le panier
        const cartItems = await pool.query(
            'SELECT c.id, c.quantity, p.id AS product_id, p.name, p.price ' +
            'FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
            [userId]
        );

        if (cartItems.rows.length === 0) {
            return res.status(400).json({ error: 'Le panier est vide.' });
        }

        // Calculer le total brut
        let totalAmount = cartItems.rows.reduce(
            (total, item) => total + parseFloat(item.price) * item.quantity,
            0
        );

        // Valider le code promo (si fourni)
        let discountAmount = 0;
        let appliedDiscountCode = null;
        if (discountCode) {
            const discountResult = await pool.query(
                'SELECT * FROM discounts WHERE code = $1 AND is_active = TRUE AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)',
                [discountCode.toUpperCase()]
            );
            if (discountResult.rows.length > 0) {
                const discount = discountResult.rows[0];
                if (discount.type === 'fixed') {
                    discountAmount = parseFloat(discount.amount);
                } else if (discount.type === 'percentage') {
                    discountAmount = totalAmount * (parseFloat(discount.amount) / 100);
                }
                appliedDiscountCode = discount.code;
            }
        }

        // Ajuster le total
        totalAmount = Math.max(0, totalAmount - discountAmount);

        // Créer une commande
        const order = await pool.query(
            'INSERT INTO orders (user_id, total_amount, discount_code, discount_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [userId, totalAmount, appliedDiscountCode, discountAmount, 'pending']
        );
        const orderId = order.rows[0].id;

        // Ajouter les articles à order_items
        for (const item of cartItems.rows) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // Créer une session Stripe
        const lineItems = cartItems.rows.map((item) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(parseFloat(item.price) * 100),
            },
            quantity: item.quantity,
        }));

        // Appliquer la réduction comme coupon Stripe
        let discounts = [];
        if (discountAmount > 0) {
            const coupon = await stripe.coupons.create({
                amount_off: Math.round(discountAmount * 100),
                currency: 'eur',
                duration: 'once',
            });
            discounts = [{ coupon: coupon.id }];
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            discounts: discounts,
            mode: 'payment',
            success_url: `${process.env.STRIPE_SUCCESS_URL}?order_id=${orderId}`,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            metadata: { order_id: orderId.toString(), user_id: userId.toString() },
        });

        res.json({ sessionId: session.id, method: 'stripe' });
    } catch (error) {
        console.error('Erreur lors de la création de la session de paiement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.confirmPayment = async (req, res) => {
    const { orderId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
        const order = await pool.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [orderId, userId]
        );

        if (order.rows.length === 0) {
            return res.status(404).json({ error: 'Commande non trouvée.' });
        }

        await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            ['paid', orderId]
        );

        await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

        res.json({ message: 'Paiement confirmé, commande validée.' });
    } catch (error) {
        console.error('Erreur lors de la confirmation du paiement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};