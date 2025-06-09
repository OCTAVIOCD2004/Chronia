// backend/Controllers/Usuarios.Controller.js
import { poolPromise } from '../DB/sqlserver.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "TokenSecretoParaFirmarJWT";

// Controllers/Usuarios.Controller.js
export const getProfile = async (req, res, next) => {
  try {
    const idUsuario = req.user.idUsuario;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('idUsuario', idUsuario)
      .query(`
        SELECT
          u.idUsuario,
          u.nombre,
          u.correo,
          u.telefono,
          u.calle,
          u.numero,
          u.colonia,
          u.codigoPostal,
          u.ciudad,
          u.estado,
          u.pais,
          u.referencia,
          u.fechaCreacion AS createdAt,
          r.nombreRol     AS rol
        FROM Usuarios u
        JOIN Roles    r ON u.idRol = r.idRol
        WHERE u.idUsuario = @idUsuario
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
};



/**
 * POST /api/usuarios/register
 * Crea un nuevo usuario (REGISTRO).
 * Body esperado (JSON):
 * {
 *   "nombre": "Texto",
 *   "correo": "correo@dominio.com",
 *   "telefono": "1234567890",
 *   "password": "TextoEncriptadoOHash",   <- aquí deberás recibir ya el hash de bcrypt
 *   "calle": "Texto", "numero": "Texto",
 *   "colonia": "Texto", "codigoPostal": "Texto",
 *   "ciudad": "Texto", "estado": "Texto", "pais": "Texto",
 *   "referencia": "TextoOpcional"
 * }
 */
export const createUsuario = async (req, res, next) => {
  try {
    const {
      nombre,
      correo,
      telefono,
      password,     // Asumimos que ya viene hasheado
      calle,
      numero,
      colonia,
      codigoPostal,
      ciudad,
      estado,
      pais,
      referencia,
      fechaCreacion = new Date(), // Por defecto, fecha actual
      rol = 'usuario' // Asignamos rol por defecto
    } = req.body;
    const pool = await poolPromise;

    // Verificar que no exista otro usuario con el mismo correo
    const exists = await pool.request()
      .input('correo', correo)
      .query(`SELECT 1 FROM Usuarios WHERE correo = @correo`);
    if (exists.recordset.length > 0) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
    }

        const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const result = await pool.request()
      .input('nombre', nombre)
      .input('correo', correo)
      .input('telefono', telefono)
      .input('password', hashedPassword)
      .input('calle', calle)
      .input('numero', numero)
      .input('colonia', colonia)
      .input('codigoPostal', codigoPostal)
      .input('ciudad', ciudad)
      .input('estado', estado)
      .input('pais', pais)
      .input('referencia', referencia)
      .query(`
        INSERT INTO Usuarios (
          nombre, correo, telefono, password, 
          calle, numero, colonia, codigoPostal, 
          ciudad, estado, pais, referencia
        )
        VALUES (
          @nombre, @correo, @telefono, @password,
          @calle, @numero, @colonia, @codigoPostal,
          @ciudad, @estado, @pais, @referencia
        );
        SELECT idUsuario, fechaCreacion
        FROM Usuarios
        WHERE correo = @correo;
      `);

    const inserted = result.recordset[0];
    const insertedId = inserted.idUsuario;

    // Generar JWT
const token = jwt.sign(
   {
     idUsuario: insertedId,
     correo,
     rol
   },
   process.env.JWT_SECRET,
   { expiresIn: '2h' }
 );

   // Ahora devolvemos token + usuario, para que el frontend lo guarde
   res.status(201).json({
     token,
     usuario: {
       idUsuario: insertedId,
       nombre,
       correo
     }
   });
  } catch (err) {
    next(err);
  }
};

export const loginUsuario = async (req, res, next) => {
  try {
    const { correo, password } = req.body;
    const pool = await poolPromise;

   // 🟢  Traemos idRol y nombre del Rol
   const result = await pool.request()
     .input('correo', correo)
     .query(`
       SELECT u.idUsuario,
              u.nombre,
              u.correo,
              u.password,
              u.idRol,
              r.nombreRol
       FROM Usuarios u
       JOIN Roles   r ON u.idRol = r.idRol
       WHERE u.correo = @correo
     `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = result.recordset[0];
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }


    const rol = usuario.nombreRol;           // "admin" o "usuario"

    // Generar JWT 
const token = jwt.sign(
  {
    idUsuario: usuario.idUsuario,
    correo: usuario.correo,
    rol: usuario.idRol === 1 ? 'admin' : 'usuario'
  },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);


    // Aquí sí estás devolviendo token + usuario
    res.json({
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol,
      token
    });
  } catch (err) {
    next(err);
  }
};


export const getUsuarioById = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('idUsuario', idUsuario)
      .query(`
        SELECT idUsuario, nombre, correo, telefono, calle, numero,
               colonia, codigoPostal, ciudad, estado, pais,
               referencia, fechaCreacion AS createdAt
        FROM Usuarios
        WHERE idUsuario = @idUsuario
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
};
