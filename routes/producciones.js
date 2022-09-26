import { Router } from 'express';

import { producciones } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/materiales
 */

//  Route example
router.get('/unico/', producciones.obtenerProduccion);
router.get('/', producciones.obtenerProducciones);
router.get('/historico/', producciones.obtenerHistorico);

router.post('/', producciones.crearProduccion);

export { router };