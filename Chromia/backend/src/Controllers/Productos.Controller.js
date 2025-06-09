import { poolPromise } from '../DB/sqlserver.js';

/**
 * GET /api/productos
 * Devuelve todos los productos con sus campos esenciales.
 */
export const getProductos = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    // Traemos: idProducto, nombre, precio, colorHexadecimal, imagenUrl, idCategoria
    const result = await pool.request().query(`
      SELECT
        idProducto, 
        nombre,
        descripcion,
        precio,
        colorHexadecimal,
        imagenUrl,
        idCategoria
      FROM Productos
      ORDER BY nombre
    `);

    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/productos/:idProducto
 * Devuelve un solo producto por su ID (detalle completo).
 */
export const getProductoById = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('idProducto', idProducto)
      .query(`
        SELECT 
          p.idProducto,
          p.nombre,
          p.descripcion,
          p.precio,
          p.colorHexadecimal,
          p.imagenUrl,
          p.idCategoria,
          c.nombreCategoria,
          p.imagenUrl
        FROM Productos p
        JOIN Categorias c ON p.idCategoria = c.idCategoria
        WHERE p.idProducto = @idProducto
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/productos
 * Inserta un nuevo producto.
 * Body esperado (JSON):
 * {
 *   "nombre": "Texto",
 *   "descripcion": "Texto",
 *   "precio": 100.00,
 *   "colorHexadecimal": "#FFFFFF",
 *   "imagenUrl": "/images/archivo.jpg",
 *   "idCategoria": 1
 * }
 */
export const createProducto = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, colorHexadecimal, imagenUrl, idCategoria } = req.body;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('precio', precio)
      .input('colorHexadecimal', colorHexadecimal)
      .input('imagenUrl', imagenUrl)
      .input('idCategoria', idCategoria)
      .query(`
        INSERT INTO Productos (
          nombre, descripcion, precio, colorHexadecimal, imagenUrl, idCategoria
        )
        VALUES (
          @nombre, @descripcion, @precio, @colorHexadecimal, @imagenUrl, @idCategoria
        );
        SELECT SCOPE_IDENTITY() AS idProducto;
      `);

    res.status(201).json({
      idProducto: result.recordset[0].idProducto,
      nombre,
      precio,
      colorHexadecimal,
      imagenUrl,
      idCategoria
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/productos/:idProducto
 * Actualiza un producto existente.
 * Body ejemplo (JSON):
 * {
 *   "nombre": "Nuevo nombre",
 *   "descripcion": "Nueva descripción",
 *   "precio": 200.00,
 *   "colorHexadecimal": "#000000",
 *   "imagenUrl": "/images/nueva-imagen.jpg",
 *   "idCategoria": 2
 * }
 */
export const updateProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { nombre, descripcion, precio, colorHexadecimal, imagenUrl, idCategoria } = req.body;
    const pool = await poolPromise;

    // Primero verificamos que exista
    const existing = await pool.request()
      .input('idProducto', idProducto)
      .query(`SELECT 1 FROM Productos WHERE idProducto = @idProducto`);
    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizamos
    await pool.request()
      .input('idProducto', idProducto)
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('precio', precio)
      .input('colorHexadecimal', colorHexadecimal)
      .input('imagenUrl', imagenUrl)
      .input('idCategoria', idCategoria)
      .query(`
        UPDATE Productos
        SET
          nombre = @nombre,
          descripcion = @descripcion,
          precio = @precio,
          colorHexadecimal = @colorHexadecimal,
          imagenUrl = @imagenUrl,
          idCategoria = @idCategoria
        WHERE idProducto = @idProducto
      `);

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/productos/:idProducto
 * Elimina un producto por su ID.
 */
export const deleteProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const pool = await poolPromise;

    // Verificamos que exista
    const existing = await pool.request()
      .input('idProducto', idProducto)
      .query(`SELECT 1 FROM Productos WHERE idProducto = @idProducto`);
    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminamos
    await pool.request()
      .input('idProducto', idProducto)
      .query(`DELETE FROM Productos WHERE idProducto = @idProducto`);

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};
