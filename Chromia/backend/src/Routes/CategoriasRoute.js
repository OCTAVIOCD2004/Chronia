// backend/src/Routes/categorias.js
import { Router } from 'express';
import { getCategorias } from '../Controllers/Categorias.Controller.js'; 
// (o donde tengas tu lógica)

const router = Router();
router.get('/', getCategorias);
// router.post('/', createCategoria);
export default router;
