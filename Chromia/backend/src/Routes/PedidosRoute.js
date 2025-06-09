import { Router } from 'express';
import {
  getPedidosByUsuario,
  getDetallePedido,
  createPedido,
  getResumenPedido
} from '../Controllers/Pedidos.Controller.js';

const router = Router();

// GET todos los pedidos de un usuario
router.get('/:idUsuario', getPedidosByUsuario);          // GET /api/pedidos/123

// GET el detalle (items) de un pedido en particular
router.get('/:idUsuario/:idPedido', getDetallePedido);   // GET /api/pedidos/123/5

// POST crear un nuevo pedido
router.post('/:idUsuario', createPedido);                // POST /api/pedidos/123
// Body: { items: [{ idProducto, cantidad, precio }, …], total: 400.00 }

// (Opcional) GET resumen de pedido
router.get('/:idUsuario/:idPedido/resumen', getResumenPedido); // GET /api/pedidos/123/5/resumen

export default router;
