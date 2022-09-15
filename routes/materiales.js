import { Router } from 'express';

import { materiales } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/materiales
 */

//  Route example
router.get('/unico/', materiales.obtenerMaterial);
router.get('/', materiales.obtenerMateriales);
router.get('/historico/', materiales.obtenerHistorico);

router.post('/', materiales.crearMaterial);

export { router };