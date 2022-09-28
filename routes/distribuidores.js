import { Router } from 'express';

import { distribuidores } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/distribuidores
 */

//  Route example
router.get('/historico/', distribuidores.obtenerHistorico);
router.get('/unico/', distribuidores.obtenerDistribuidor);
router.get('/', distribuidores.obtenerDistribuidores);

router.post('/', distribuidores.crearDistribuidor);

export { router };