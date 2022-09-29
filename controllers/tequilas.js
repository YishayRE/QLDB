import { response, request } from 'express';
import QLDB from '../database/config.js';

const obtenerHistorico = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const head = req.headers.id;
        let tablas;

        if(head)
            tablas = qldb.transaccionParamsArray("SELECT * FROM history( Tequila ) WHERE metadata.id = ?;", [head]);
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

const obtenerTequila = async(req = request, res = response) => {
    const qldb = new QLDB();
    const head = req.headers.id;
    let tablas;

    if(head){
        const headers = JSON.parse(head);

        tablas = qldb.transaccionParams("SELECT * FROM _ql_committed_Tequila where metadata.id = ? OR metadata.id = ?;", [headers.agave, headers.cristal]);
    }
    else
        tablas = qldb.transaccion('SELECT * FROM _ql_committed_Tequila;');
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

const obtenerTequilas = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const tablas = qldb.transaccion("SELECT t.metadata.id, t.data.lote, t.data.idDistribuidor FROM _ql_committed_Tequila AS t");
        
        const resp = await tablas;
        let respuesta = [];
    
        if(resp.getResultList().length > 0)
            respuesta = JSON.parse(JSON.stringify(resp.getResultList(), null, 2));
        else 
            throw new Error('No hay datos');
        
        const tequilas = respuesta.map(async(trans) => {
            const material = qldb.transaccionParamsArray("SELECT m.data.nombre, m.data.lugar, p.data.lugarProduccion FROM _ql_committed_Distribuidor AS m INNER JOIN _ql_committed_Distribucion AS d ON d.metadata.id = m.data.idDistribucion INNER JOIN _ql_committed_Produccion AS p ON p.metadata.id = d.data.idProduccion WHERE m.metadata.id = ?;", [trans.idDistribuidor]);
        
            const respM = await material;
            let respuestaM = [];
        
            if(respM.getResultList().length === 1)
                respuestaM = JSON.parse(JSON.stringify(respM.getResultList(), null, 2));
            else 
                respuestaM = {Nombre: 'Error en los datos'}

            return {
                ...trans,
                nombre: respuestaM[0].nombre,
                lugar: respuestaM[0].lugar,
                lugarProduccion: respuestaM[0].lugarProduccion
            }
        });

        const transMat = await Promise.all(tequilas);

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

const crearTequila = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const body = req.body;
        let tablas;
        
        if(body)
            tablas = qldb.transaccionParamsObj("INSERT INTO Tequila ?;", body);
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
    obtenerTequila,
    obtenerTequilas,
    crearTequila
}