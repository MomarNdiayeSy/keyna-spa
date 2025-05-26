const pool = require('../config/db');

exports.createDiscount = async (req, res) => {
    const { code, amount, type, valid_until, max_uses, max_users } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO discounts (code, amount, type, valid_until, max_uses, max_users, current_uses) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [code.toUpperCase(), amount, type, valid_until, max_uses || null, max_users || null, 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création du code promo:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getDiscounts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM discounts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des codes promo:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateDiscount = async (req, res) => {
    const { id } = req.params;
    const { code, amount, type, valid_until, is_active, max_uses, max_users } = req.body;
    try {
        const result = await pool.query(
            'UPDATE discounts SET code = $1, amount = $2, type = $3, valid_until = $4, is_active = $5, max_uses = $6, max_users = $7 WHERE id = $8 RETURNING *',
            [code.toUpperCase(), amount, type, valid_until, is_active, max_uses || null, max_users || null, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Code promo non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du code promo:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteDiscount = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM discounts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Code promo non trouvé' });
        }
        res.json({ message: 'Code promo supprimé' });
    } catch (error) {
        console.error('Erreur lors de la suppression du code promo:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.validateDiscount = async (req, res) => {
    const { code } = req.body;
    const userId = req.user.id; // Supposons que req.user est défini par le middleware auth
    try {
        // Vérifier si le code existe, est actif et non expiré
        const discountResult = await pool.query(
            'SELECT * FROM discounts WHERE code = $1 AND is_active = TRUE AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)',
            [code.toUpperCase()]
        );
        if (discountResult.rows.length === 0) {
            return res.status(404).json({ error: 'Code promo invalide ou expiré' });
        }
        const discount = discountResult.rows[0];

        // Vérifier le nombre total d'utilisations
        if (discount.max_uses && discount.current_uses >= discount.max_uses) {
            return res.status(400).json({ error: 'Limite d’utilisations atteinte' });
        }

        // Vérifier si l'utilisateur a déjà utilisé ce code
        const usageResult = await pool.query(
            'SELECT * FROM discount_usage WHERE discount_id = $1 AND user_id = $2',
            [discount.id, userId]
        );
        if (usageResult.rows.length > 0) {
            return res.status(400).json({ error: 'Vous avez déjà utilisé ce code promo' });
        }

        // Vérifier le nombre d'utilisateurs uniques
        if (discount.max_users) {
            const userCountResult = await pool.query(
                'SELECT COUNT(DISTINCT user_id) AS user_count FROM discount_usage WHERE discount_id = $1',
                [discount.id]
            );
            const userCount = parseInt(userCountResult.rows[0].user_count);
            if (userCount >= discount.max_users) {
                return res.status(400).json({ error: 'Limite d’utilisateurs atteinte' });
            }
        }

        res.json(discount);
    } catch (error) {
        console.error('Erreur lors de la validation du code promo:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.applyDiscount = async (req, res) => {
    const { code } = req.body;
    const userId = req.user.id; // Supposons que req.user est défini par le middleware auth
    try {
        // Vérifier si le code existe
        const discountResult = await pool.query(
            'SELECT * FROM discounts WHERE code = $1 AND is_active = TRUE AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)',
            [code.toUpperCase()]
        );
        if (discountResult.rows.length === 0) {
            return res.status(404).json({ error: 'Code promo invalide ou expiré' });
        }
        const discount = discountResult.rows[0];

        // Vérifier les limites (comme dans validateDiscount)
        if (discount.max_uses && discount.current_uses >= discount.max_uses) {
            return res.status(400).json({ error: 'Limite d’utilisations atteinte' });
        }

        const usageResult = await pool.query(
            'SELECT * FROM discount_usage WHERE discount_id = $1 AND user_id = $2',
            [discount.id, userId]
        );
        if (usageResult.rows.length > 0) {
            return res.status(400).json({ error: 'Vous avez déjà utilisé ce code promo' });
        }

        if (discount.max_users) {
            const userCountResult = await pool.query(
                'SELECT COUNT(DISTINCT user_id) AS user_count FROM discount_usage WHERE discount_id = $1',
                [discount.id]
            );
            const userCount = parseInt(userCountResult.rows[0].user_count);
            if (userCount >= discount.max_users) {
                return res.status(400).json({ error: 'Limite d’utilisateurs atteinte' });
            }
        }

        // Enregistrer l'utilisation
        await pool.query(
            'INSERT INTO discount_usage (discount_id, user_id) VALUES ($1, $2)',
            [discount.id, userId]
        );

        // Incrémenter current_uses
        await pool.query(
            'UPDATE discounts SET current_uses = current_uses + 1 WHERE id = $1',
            [discount.id]
        );

        res.json({ message: 'Code promo appliqué avec succès' });
    } catch (error) {
        console.error('Erreur lors de l’application du code promo:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};