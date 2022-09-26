import { Router } from 'express';

import { transportes } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/transportes
 */

//  Route example
router.get('/unico/', transportes.obtenerTransporte);
router.get('/', transportes.obtenerTransportes);
router.get('/historico/', transportes.obtenerHistorico);

router.post('/', transportes.crearTransporte);

export { router };