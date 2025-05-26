require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const serviceRoutes = require('./routes/serviceRoutes');
const productRoutes = require('./routes/productRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const vipRoutes = require('./routes/vipRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const statisticsController = require('./controllers/statisticsController');
const auth = require('./middlewares/auth');
const roleCheck = require('./middlewares/roleCheck');
const historyRoutes = require('./routes/historyRoutes');
const discountRoutes = require('./routes/discountRoutes');
const orderRoutes = require('./routes/orderRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const tariffRoutes = require('./routes/tariffRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('API du KEYNA SPA est opérationnelle');
});
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vip', vipRoutes);
app.use('/api/payments', paymentRoutes);
app.get('/api/statistics', auth, roleCheck('admin'), statisticsController.getStatistics);
app.use('/api/history', historyRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/tariffs', tariffRoutes);
app.use('/api/schedules', scheduleRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});