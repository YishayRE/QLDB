import { response, request } from 'express';
import QLDB from '../database/config.js';

const obtenerHistorico = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const head = req.headers.id;
        let tablas;

        if(head)
            tablas = qldb.transaccionParamsArray("SELECT * FROM history( Produccion ) WHERE metadata.id = ?;", [head]);
        else
            throw new Error('No hay id de produccion');
        
        const resp = await tablas;
    
        if(resp.getResultList().length > 0) {
            const respuesta = JSON.parse(JSON.stringify(resp.getResultList(), null, 2));
            
            res.status(200).json({
                respuesta
            });
        }
        else 
            throw new Error('No hay datos');
    }
    catch(error) {
        console.log(error);
        
        res.status(404).json({
            msg: error.message
        });
    }
};

const obtenerProduccion = async(req = request, res = response) => {
    const qldb = new QLDB();
    const head = req.headers.id;
    let tablas;

    if(head)
        tablas = qldb.transaccionParams("SELECT * FROM _ql_committed_Produccion where metadata.id = ?;", [head]);
    else
        tablas = qldb.transaccion('SELECT * FROM _ql_committed_Produccion;');

    const resp = await tablas;

    if(resp.getResultList().length > 0) {
        const respuesta = JSON.parse(JSON.stringify(resp.getResultList(), null, 2));
        const respuestaData = respuesta.map(resp => {
            return {
                ...resp.data,
                _id: resp.metadata.id
            }
        });

        res.status(200).json({
            respuesta: respuestaData
        });
    }
    else {
        res.status(404).json({
            respuesta: []
        });
    }
};

const obtenerProducciones = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const tablas = qldb.transaccion("SELECT * FROM _ql_committed_Produccion;");
        
        const resp = await tablas;
    
        if(resp.getResultList().length > 0) {
            const respuesta = JSON.parse(JSON.stringify(resp.getResultList(), null, 2));
            const respuestaData = respuesta.map(resp => {
                return {
                    ...resp.data,
                    _id: resp.metadata.id
                }
            });
    
            res.status(200).json({
                respuesta: respuestaData
            });
        }
        else 
            throw new Error('No hay datos');
    }
    catch(error) {
        console.log(error);
        
        res.status(404).json({
            msg: error.message
        });
    }
};

const crearProduccion = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const body = req.body;
        let tablas;
        
        if(body)
            tablas = qldb.transaccionParamsObj("INSERT INTO Produccion ?;", body);
        else
            throw new Error('No hay datos');
    
        const resp = await tablas;
    
        if(resp.getResultList().length > 0) {
            const respuesta = JSON.parse(JSON.stringify(resp.getResultList(), null, 2));
            const respuestaData = respuesta.map(resp => {
                return {
                    id: resp.documentId[0],
                }
            });
    
            res.status(200).json({
                respuesta: respuestaData
            });
        }
        else
            throw new Error('No hay datos');
    }
    catch(error) {
        console.log(error);
        
        res.status(404).json({
            msg: error.message
        });
    }
};

export {
    obtenerHistorico,
    obtenerProduccion,
    obtenerProducciones,
    crearProduccion
}