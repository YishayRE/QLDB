import { Router } from 'express';

import { examples } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/examples
 */

//  Route example
router.get('/', examples.example);
router.get('/material', examples.material);
router.get('/produccion', examples.produccion);
router.get('/tequila', examples.tequila);
router.get('/viaje', examples.viaje);

export { router };