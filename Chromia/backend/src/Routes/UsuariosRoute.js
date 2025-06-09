import { Router } from 'express';
import {
  getUsuarioById,
  createUsuario,
  loginUsuario,
  getProfile
} from '../Controllers/Usuarios.Controller.js';
import { authMiddleware } from '../Middlewares/Auth.Middleware.js';

const router = Router();

router.get('/me', authMiddleware, getProfile);

router.post('/register', createUsuario);   // POST /api/usuarios/register
router.post('/login',    loginUsuario);    // POST /api/usuarios/login
router.get('/:idUsuario', getUsuarioById); // GET /api/usuarios/123

export default router;
