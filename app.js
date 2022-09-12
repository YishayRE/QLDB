import * as dotenv from 'dotenv';
dotenv.config();

import { Server } from './models/index.js';

const server = new Server();

server.listen();