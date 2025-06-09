import { poolPromise } from '../DB/sqlserver.js';

export const getCategorias = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool.request().query('SELECT nombreCategoria, descripcion FROM Categorias');
    res.json(recordset);
  } catch (err) {
    next(err);
  }
};
