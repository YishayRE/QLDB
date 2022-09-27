import { response, request } from 'express';
import QLDB from '../database/config.js';

const obtenerHistorico = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const head = req.headers.id;
        let tablas;

        if(head)
            tablas = qldb.transaccionParamsArray("SELECT * FROM history( Distribuidor ) WHERE metadata.id = ?;", [head]);
        else
            throw new Error('No hay id de material');
        
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

const obtenerDistribuidor = async(req = request, res = response) => {
    const qldb = new QLDB();
    const head = req.headers.id;
    let tablas;

    if(head){
        const headers = JSON.parse(head);

        tablas = qldb.transaccionParams("SELECT * FROM _ql_committed_Distribuidor where metadata.id = ? OR metadata.id = ?;", [headers.agave, headers.cristal]);
    }
    else
        tablas = qldb.transaccion('SELECT * FROM _ql_committed_Distribuidor;');
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

const obtenerDistribuidores = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const tablas = qldb.transaccion("SELECT t.metadata.id, t.data.idDistribuidor, t.data.origen, t.data.destino, t.data.fechaInicio, t.data.fechaFin, t.data._idMaterial FROM _ql_committed_Distribuidor AS t");
        
        const resp = await tablas;
        let respuesta = [];
    
        if(resp.getResultList().length > 0)
            respuesta = JSON.parse(JSON.stringify(resp.getResultList(), null, 2));
        else 
            throw new Error('No hay datos');
        
        const distribuidores = respuesta.map(async(trans) => {
            const material = qldb.transaccionParamsArray("SELECT m.data.Nombre FROM _ql_committed_Material AS m WHERE m.metadata.id = ?", [trans._idMaterial]);
        
            const respM = await material;
            let respuestaM = [];
        
            if(respM.getResultList().length === 1)
                respuestaM = JSON.parse(JSON.stringify(respM.getResultList(), null, 2));
            else 
                respuestaM = {Nombre: 'Error en los datos'}

            return {
                ...trans,
                Nombre: respuestaM[0].Nombre
            }
        });

        const transMat = await Promise.all(distribuidores);

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

const crearDistribuidor = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const body = req.body;
        let tablas;
        
        console.log(body);
/*
        if(body)
            tablas = qldb.transaccionParamsObj("INSERT INTO Distribuidor ?;", body);
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
        else */
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
    obtenerDistribuidor,
    obtenerDistribuidores,
    crearDistribuidor
}