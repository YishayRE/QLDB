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
            example: '/api/example'
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