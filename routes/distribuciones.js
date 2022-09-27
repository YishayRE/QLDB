import { Router } from 'express';

import { tequilas } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/tequilas
 */

//  Route example
router.get('/historico/', tequilas.obtenerHistorico);
router.get('/unico/', tequilas.obtenerTequila);
router.get('/', tequilas.obtenerTequilas);

router.post('/', tequilas.crearTequila);

export { router };