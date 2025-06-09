// backend/src/Routes/ProductosRoute.js
import { Router } from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from '../Controllers/Productos.Controller.js';

// OJO ── los 2 middlewares deben estar en   /middlewares/   todo minúsculas
import { authMiddleware } from "../Middlewares/Auth.Middleware.js";
import { authAdminMiddleware } from "../Middlewares/Admin.Middleware.js";

const router = Router();

/*──────────────────────────────
  ENDPOINTS PÚBLICOS (sin token)
───────────────────────────────*/
router.get('/',              getProductos);              // GET /api/productos
router.get('/:idProducto',   getProductoById);           // GET /api/productos/5

/*──────────────────────────────
  ENDPOINTS SOLO-ADMIN (token + rol)
───────────────────────────────*/
router.post(
  '/',
  authMiddleware,
  authAdminMiddleware,
  createProducto            // POST /api/productos
);

router.put(
  '/:idProducto',
  authMiddleware,
  authAdminMiddleware,
  updateProducto            // PUT /api/productos/5
);

router.delete(
  '/:idProducto',
  authMiddleware,
  authAdminMiddleware,
  deleteProducto            // DELETE /api/productos/5
);

export default router;
