// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "TokenSecretoParaFirmarJWT";

export function authMiddleware(req, res, next) {
  // El token vendrá en el header “Authorization: Bearer <token>”
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Falta el token de autorización." });
  }
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Formato de token inválido." });
  }

  try {
    // 1. Verificar JWT
    const payload = jwt.verify(token, JWT_SECRET);
    // 2. Colocamos en req.user el idUsuario y correo del payload
    req.user = {
      idUsuario: payload.idUsuario,
      correo: payload.correo,
      rol: payload.rol // Asegúrate de que el rol esté incluido en el token
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
}

export const authAdminMiddleware = (req, res, next) => {
  const { rol } = req.user; // el rol debe estar disponible tras authMiddleware

  if (rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
  }
  next();
};
