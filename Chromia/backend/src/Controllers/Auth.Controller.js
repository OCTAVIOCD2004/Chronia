import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/sqlServerDriver.js";

// Leer la clave secreta de JWT de .env
const JWT_SECRET = process.env.JWT_SECRET || "cambiame_por_un_valor_secreto";

export async function register(req, res) {
  const {
    nombre, correo, password, telefono, calle, numero, colonia,
    codigoPostal, ciudad, estado, pais, referencia
  } = req.body;

  try {
    const checkUser = await pool.request()
      .input("correo", correo)
      .query("SELECT idUsuario FROM Usuarios WHERE correo = @correo");
    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "El correo ya está en uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.request()
      .input("nombre", nombre)
      .input("correo", correo)
      .input("password_hash", hashedPassword)
      .input("telefono", telefono || null)
      .input("calle", calle || null)
      .input("numero", numero || null)
      .input("colonia", colonia || null)
      .input("codigoPostal", codigoPostal || null)
      .input("ciudad", ciudad || null)
      .input("estado", estado || null)
      .input("pais", pais || null)
      .input("referencia", referencia || null)
      .query(`
        INSERT INTO Usuarios 
        (nombre, correo, password_hash, telefono, calle, numero, colonia, codigoPostal, ciudad, estado, pais, referencia, rol)
        VALUES (@nombre, @correo, @password_hash, @telefono, @calle, @numero, @colonia, @codigoPostal, @ciudad, @estado, @pais, @referencia, 'usuario');
        SELECT SCOPE_IDENTITY() AS idUsuario;
      `);

    const insertedId = result.recordset[0].idUsuario;

    const token = jwt.sign(
      { idUsuario: insertedId, correo, rol: 'usuario' },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true si usas HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return res.status(201).json({
      usuario: { idUsuario: insertedId, nombre, correo, rol: 'usuario' }
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function login(req, res) {
  const { correo, password } = req.body;

  try {
    const userResult = await pool.request()
      .input("correo", correo)
      .query(`
        SELECT idUsuario, nombre, correo, password_hash, rol
        FROM Usuarios
        WHERE correo = @correo
      `);

    if (userResult.recordset.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const user = userResult.recordset[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { idUsuario: user.idUsuario, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3 * 60 * 60 * 1000, // 3 horas
    });

    return res.json({
      usuario: {
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}
