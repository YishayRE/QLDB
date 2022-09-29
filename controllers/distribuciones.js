import { response, request } from 'express';
import QLDB from '../database/config.js';

const obtenerHistorico = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const head = req.headers.id;
        let tablas;

        if(head)
            tablas = qldb.transaccionParamsArray("SELECT * FROM history( Distribucion ) WHERE metadata.id = ?;", [head]);
        else
            throw new Error('No hay id de distribución');
        
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

const obtenerDistribucion = async(req = request, res = response) => {
    const qldb = new QLDB();
    const head = req.headers.id;
    let tablas;

    if(head){
        const headers = JSON.parse(head);

        tablas = qldb.transaccionParams("SELECT * FROM _ql_committed_Distribucion where metadata.id = ? OR metadata.id = ?;", [headers.agave, headers.cristal]);
    }
    else
        tablas = qldb.transaccion('SELECT * FROM _ql_committed_Distribucion;');
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

const obtenerDistribuciones = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const tablas = qldb.transaccion("SELECT t.metadata.id, t.data.fechaInicio, t.data.fechaFin, t.data.idProduccion, t.data.idDistribucion FROM _ql_committed_Distribucion AS t");
        
        const resp = await tablas;
        let respuesta = [];
    
        if(resp.getResultList().length > 0)
            respuesta = JSON.parse(JSON.stringify(resp.getResultList(), null, 2));
        else 
            throw new Error('No hay datos');
        
        const distribuciones = respuesta.map(async(trans) => {
            const produccion = qldb.transaccionParamsArray("SELECT m.data.lugarProduccion FROM _ql_committed_Produccion AS m WHERE m.metadata.id = ?", [trans.idProduccion]);
        
            const respM = await produccion;
            let respuestaM = [];
        
            if(respM.getResultList().length === 1)
                respuestaM = JSON.parse(JSON.stringify(respM.getResultList(), null, 2));
            else 
                respuestaM = {Nombre: 'Error en los datos'}

            return {
                ...trans,
                lugarProduccion: respuestaM[0].lugarProduccion
            }
        });

        const transMat = await Promise.all(distribuciones);

        res.status(200).json({
            respuesta: transMat
        });
    }
    catch(error) {
        console.log(error);
        
        res.status(404).json({
            msg: error.message
        });
    }
};

const crearDistribucion = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const body = req.body;
        let tablas;
        
        if(body)
            tablas = qldb.transaccionParamsObj("INSERT INTO Distribucion ?;", body);
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
    obtenerDistribucion,
    obtenerDistribuciones,
    crearDistribucion
}