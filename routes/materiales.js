import { Router } from 'express';

import { materiales } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/materiales
 */

//  Route example
router.get('/historia/', materiales.obtenerHistoria);
router.get('/historico/', materiales.obtenerHistorico);
router.get('/unico/', materiales.obtenerMaterial);
router.get('/', materiales.obtenerMateriales);

router.post('/', materiales.crearMaterial);

export { router };