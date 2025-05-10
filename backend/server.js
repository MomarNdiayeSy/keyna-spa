require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const serviceRoutes = require('./routes/serviceRoutes');
   const productRoutes = require('./routes/productRoutes');
   const bookingRoutes = require('./routes/bookingRoutes');
   const authRoutes = require('./routes/authRoutes');
   const cartRoutes = require('./routes/cartRoutes');
   const userRoutes = require('./routes/userRoutes');
   const vipRoutes = require('./routes/vipRoutes');
   const contactRoutes = require('./routes/contactRoutes');
   const vipRoutes = require('./routes/vipRoutes');
app.use('/api/vip', vipRoutes);

   const app = express();

   // Middleware
   app.use(cors());
   app.use(express.json());

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
   app.use('/api/contact', contactRoutes);

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