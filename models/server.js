import express, { json, static as estatic } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';

import * as routes from '../routes/index.js';
import QLDB from '../database/config.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);

        this.paths = {
            example: '/api/example',
            distribuciones: '/api/distribuciones',
            distribuidores: '/api/distribuidores',
            materiales: '/api/materiales',
            producciones: '/api/producciones',
            tequila: '/api/tequilas',
            transportes: '/api/transportes'
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Tareas programadas
        this.crons();
    }

    async conectarDB() {
        try{
            const qldb = new QLDB();
            await qldb.getTablas();
            console.log('QLDB conectada');
        }
        catch(e){
            throw new Error(e);
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(json());

        // Directorio Público
        this.app.use(estatic('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.example, routes.examples);
        this.app.use(this.paths.distribuciones, routes.distribuciones);
        this.app.use(this.paths.distribuidores, routes.distribuidores);
        this.app.use(this.paths.materiales, routes.materiales);
        this.app.use(this.paths.producciones, routes.producciones);
        this.app.use(this.paths.tequila, routes.tequilas);
        this.app.use(this.paths.transportes, routes.transportes);
    }

    crons() {
        //crons();
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

export default Server;