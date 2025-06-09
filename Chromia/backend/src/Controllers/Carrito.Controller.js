// backend/Controllers/Carrito.Controller.js
import { poolPromise } from '../DB/sqlserver.js';

/* ────────── helpers ────────── */
async function ensureCarrito(pool, idUsuario) {
  // Devuelve { idCarrito } — crea el carrito si nunca existió
  const res = await pool.request()
    .input('idUsuario', idUsuario)
    .query(`
      SELECT idCarrito
      FROM Carrito
      WHERE idUsuario = @idUsuario
    `);

  if (res.recordset.length > 0) {
    return { idCarrito: res.recordset[0].idCarrito, created: false };
  }

  // 👇  NO usamos createdAt porque la columna no existe en tu tabla
  const nuevo = await pool.request()
    .input('idUsuario', idUsuario)
    .query(`
      INSERT INTO Carrito (idUsuario)
      OUTPUT INSERTED.idCarrito
      VALUES (@idUsuario)
    `);

  return { idCarrito: nuevo.recordset[0].idCarrito, created: true };
}

async function cargarItems(pool, idCarrito) {
  const items = await pool.request()
    .input('idCarrito', idCarrito)
    .query(`
      SELECT 
        dc.idDetalle       AS idDetalleCarrito,
        dc.idProducto,
        p.nombre           AS nombreProducto,
        p.precio           AS precioUnitario,
        dc.cantidad,
        p.imagenUrl
      FROM DetalleCarrito dc
      JOIN Productos p ON dc.idProducto = p.idProducto
      WHERE dc.idCarrito = @idCarrito
      ORDER BY p.nombre
    `);

  return items.recordset;            // siempre devuelve []
}

/* ────────── GET /api/carrito ────────── */
export const getCarritoByUsuario = async (req, res, next) => {
  try {
    const idUsuario = req.user.idUsuario;
    const pool      = await poolPromise;

    const { idCarrito } = await ensureCarrito(pool, idUsuario);
    const items         = await cargarItems(pool, idCarrito);

    res.json({ idCarrito, items });
  } catch (err) { next(err); }
};

/* ────────── POST /api/carrito ────────── */
export const addToCarrito = async (req, res, next) => {
  try {
    const idUsuario          = req.user.idUsuario;
    const { idProducto, cantidad = 1 } = req.body;
    const pool               = await poolPromise;

    const { idCarrito } = await ensureCarrito(pool, idUsuario);

    const existe = await pool.request()
      .input('idCarrito',  idCarrito)
      .input('idProducto', idProducto)
      .query(`
        SELECT cantidad
        FROM DetalleCarrito
        WHERE idCarrito = @idCarrito AND idProducto = @idProducto
      `);

    if (existe.recordset.length > 0) {
      const nuevaCant = existe.recordset[0].cantidad + cantidad;
      await pool.request()
        .input('idCarrito',  idCarrito)
        .input('idProducto', idProducto)
        .input('cantidad',   nuevaCant)
        .query(`
          UPDATE DetalleCarrito
          SET cantidad = @cantidad
          WHERE idCarrito = @idCarrito AND idProducto = @idProducto
        `);
    } else {
      await pool.request()
        .input('idCarrito',  idCarrito)
        .input('idProducto', idProducto)
        .input('cantidad',   cantidad)
        .query(`
          INSERT INTO DetalleCarrito (idCarrito, idProducto, cantidad)
          VALUES (@idCarrito, @idProducto, @cantidad)
        `);
    }

    const items = await cargarItems(pool, idCarrito);
    res.status(201).json({ idCarrito, items });
  } catch (err) { next(err); }
};

/* ────────── PUT /api/carrito ────────── */
export const updateCarritoItem = async (req, res, next) => {
  try {
    const idUsuario          = req.user.idUsuario;
    const { idProducto, cantidad } = req.body;
    const pool               = await poolPromise;

    const { idCarrito } = await ensureCarrito(pool, idUsuario);

    if (cantidad <= 0) {
      await pool.request()
        .input('idCarrito',  idCarrito)
        .input('idProducto', idProducto)
        .query(`
          DELETE FROM DetalleCarrito
          WHERE idCarrito = @idCarrito AND idProducto = @idProducto
        `);
    } else {
      await pool.request()
        .input('idCarrito',  idCarrito)
        .input('idProducto', idProducto)
        .input('cantidad',   cantidad)
        .query(`
          UPDATE DetalleCarrito
          SET cantidad = @cantidad
          WHERE idCarrito = @idCarrito AND idProducto = @idProducto
        `);
    }

    const items = await cargarItems(pool, idCarrito);
    res.json({ idCarrito, items });
  } catch (err) { next(err); }
};

/* ────────── DELETE /api/carrito/:idProd ────────── */
export const deleteCarritoItem = async (req, res, next) => {
  try {
    const idUsuario = req.user.idUsuario;
    const { idProd } = req.params;           // /carrito/123
    const pool       = await poolPromise;

    const { idCarrito } = await ensureCarrito(pool, idUsuario);

    await pool.request()
      .input('idCarrito',  idCarrito)
      .input('idProducto', idProd)
      .query(`
        DELETE FROM DetalleCarrito
        WHERE idCarrito = @idCarrito AND idProducto = @idProducto
      `);

    const items = await cargarItems(pool, idCarrito);
    res.json({ idCarrito, items });
  } catch (err) { next(err); }
};
