import { poolPromise } from '../DB/sqlserver.js';

/**
 * GET /api/pedidos/:idUsuario
 * Devuelve todos los pedidos de un usuario, sin los detalles:
 *  - idPedido, fechaPedido, total
 */
export const getPedidosByUsuario = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('idUsuario', idUsuario)
      .query(`
        SELECT
          idPedido,
          fechaPedido,
          total
        FROM Pedidos
        WHERE idUsuario = @idUsuario
        ORDER BY fechaPedido DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/pedidos/:idUsuario/:idPedido
 * Devuelve el detalle completo de un pedido (JOIN con DetallePedido y Productos).
 */
export const getDetallePedido = async (req, res, next) => {
  try {
    const { idUsuario, idPedido } = req.params;
    const pool = await poolPromise;

    // Verificar que ese pedido corresponde a ese usuario
    const existePedido = await pool.request()
      .input('idPedido', idPedido)
      .input('idUsuario', idUsuario)
      .query(`
        SELECT 1
        FROM Pedidos
        WHERE idPedido = @idPedido AND idUsuario = @idUsuario
      `);
    if (existePedido.recordset.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado o no corresponde a este usuario' });
    }

    // Obtener los detalles del pedido
    const detalles = await pool.request()
      .input('idPedido', idPedido)
      .query(`
        SELECT
          dp.idDetallePedido,
          dp.idProducto,
          p.nombre           AS nombreProducto,
          dp.cantidad,
          dp.precio          AS precioUnitario,
          (dp.cantidad * dp.precio) AS subtotal
        FROM DetallePedido dp
        JOIN Productos p ON dp.idProducto = p.idProducto
        WHERE dp.idPedido = @idPedido
        ORDER BY p.nombre
      `);

    res.json({
      idPedido: Number(idPedido),
      items: detalles.recordset
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/pedidos/:idUsuario
 * Crea un nuevo pedido para el usuario. Body:
 * {
 *   "items": [
 *     { "idProducto": 1, "cantidad": 2, "precio": 100.00 },
 *     { "idProducto": 3, "cantidad": 1, "precio": 200.00 }
 *   ],
 *   "total": 400.00
 * }
 *
 * Estrategia:  
 *  1) Insertar fila en Pedidos (idUsuario, total) → devolver idPedido.  
 *  2) Insertar en DetallePedido cada item con ese idPedido.  
 *  3) (Opcional) Vaciar el carrito del usuario (DELETE FROM DetalleCarrito WHERE idCarrito = …).  
 */
export const createPedido = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const { items, total } = req.body;
    const pool = await poolPromise;

    // 1) Verificar que el usuario existe
    const usuarioExiste = await pool.request()
      .input('idUsuario', idUsuario)
      .query(`SELECT 1 FROM Usuarios WHERE idUsuario = @idUsuario`);
    if (usuarioExiste.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2) Insertar en Pedidos
    const pedidoResult = await pool.request()
      .input('idUsuario', idUsuario)
      .input('total', total)
      .query(`
        INSERT INTO Pedidos (idUsuario, total)
        VALUES (@idUsuario, @total);
        SELECT SCOPE_IDENTITY() AS idPedido;
      `);
    const idPedido = pedidoResult.recordset[0].idPedido;

    // 3) Insertar en DetallePedido cada item
    for (const item of items) {
      const { idProducto, cantidad, precio } = item;

      await pool.request()
        .input('idPedido', idPedido)
        .input('idProducto', idProducto)
        .input('cantidad', cantidad)
        .input('precio', precio)
        .query(`
          INSERT INTO DetallePedido (idPedido, idProducto, cantidad, precio)
          VALUES (@idPedido, @idProducto, @cantidad, @precio)
        `);
    }

    // 4) (Opcional) Vaciar carrito de este usuario
    // Si quieres vaciar a cero el carrito, descomenta:
    // await pool.request()
    //   .input('idUsuario', idUsuario)
    //   .query(\`
    //     DELETE dc
    //     FROM DetalleCarrito dc
    //     JOIN Carrito c ON dc.idCarrito = c.idCarrito
    //     WHERE c.idUsuario = @idUsuario\`);

    res.status(201).json({
      idPedido,
      message: 'Pedido creado exitosamente'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/pedidos/:idUsuario/:idPedido/resumen
 * Devuelve información resumida del pedido (fecha, total, número de items, etc.)
 * (Opcional, si quieres un endpoint extra).
 */
export const getResumenPedido = async (req, res, next) => {
  try {
    const { idUsuario, idPedido } = req.params;
    const pool = await poolPromise;

    // Verificar que ese pedido pertenece a ese usuario:
    const existePedido = await pool.request()
      .input('idPedido', idPedido)
      .input('idUsuario', idUsuario)
      .query(`
        SELECT fechaPedido, total
        FROM Pedidos
        WHERE idPedido = @idPedido AND idUsuario = @idUsuario
      `);

    if (existePedido.recordset.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado o no corresponde a este usuario' });
    }

    const { fechaPedido, total } = existePedido.recordset[0];

    // Contar número de items
    const countItems = await pool.request()
      .input('idPedido', idPedido)
      .query(`
        SELECT COUNT(*) AS cantidadItems
        FROM DetallePedido
        WHERE idPedido = @idPedido
      `);

    res.json({
      idPedido: Number(idPedido),
      fechaPedido,
      total,
      cantidadItems: countItems.recordset[0].cantidadItems
    });
  } catch (err) {
    next(err);
  }
};
