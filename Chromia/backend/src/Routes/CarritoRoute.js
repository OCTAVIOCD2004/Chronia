import { Router } from 'express';
import {
  getCarritoByUsuario,
  addToCarrito,
  updateCarritoItem,
  deleteCarritoItem
} from '../Controllers/Carrito.Controller.js';
import { authMiddleware } from '../Middlewares/Auth.Middleware.js';

const router = Router();
router.use(authMiddleware);        // todo lo que sigue requiere token


router.get('/',            getCarritoByUsuario);           // GET /api/carrito
router.post('/',           addToCarrito);                  // POST /api/carrito
router.put('/',            updateCarritoItem);             // PUT  /api/carrito
router.delete('/:idProd',  deleteCarritoItem);             // DELETE /api/carrito/55
export default router;
