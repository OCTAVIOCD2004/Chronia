import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";

// Routers
import categoriasRouter from './Routes/CategoriasRoute.js';
import productosRouter   from './Routes/ProductosRoute.js';
import usuariosRouter    from './Routes/UsuariosRoute.js';
import carritoRouter     from './Routes/CarritoRoute.js';
import pedidosRouter     from './Routes/PedidosRoute.js';
import { authMiddleware } from './Middlewares/Auth.Middleware.js';
import { getProfile } from './Controllers/Usuarios.Controller.js';
import CheckoutRouter from './Routes/CheckoutRoute.js';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Monta todas las rutas
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos',  productosRouter);
app.use('/api/usuarios',   usuariosRouter);
app.use('/api/carrito',    carritoRouter);
app.use('/api/pedidos',    pedidosRouter);
app.use('/api/checkout',   CheckoutRouter);

// Ruta raíz como health-check (opcional)
app.get('/', (_req, res) => {
  res.send('✅ API de Chromia corriendo');
});

// Error handler genérico
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
