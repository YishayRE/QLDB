import { Router } from 'express';

import { distribuciones } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/distribuciones
 */

//  Route example
router.get('/historico/', distribuciones.obtenerHistorico);
router.get('/unico/', distribuciones.obtenerDistribucion);
router.get('/', distribuciones.obtenerDistribuciones);

router.post('/', distribuciones.crearDistribucion);

export { router };