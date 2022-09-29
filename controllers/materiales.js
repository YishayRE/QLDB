import { response, request } from 'express';
import QLDB from '../database/config.js';

const obtenerHistoria = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const head = req.headers.id;
        let material;
        let produccion;
        let transporte;
        let distribucion;
        let distribuidor;
        let tequila;

        //material
        if(head)
            material = qldb.transaccionParamsArray("SELECT * FROM _ql_committed_Material WHERE metadata.id = ?;", [head]);
        else
            throw new Error('No hay id de material');
        
        const respM = await material;
        let respuestaM;
        
        if(respM.getResultList().length > 0)
            respuestaM = JSON.parse(JSON.stringify(respM.getResultList(), null, 2));
        else 
            throw new Error('No hay datos');

        //transporte
        transporte = qldb.transaccionParamsArray("SELECT * FROM _ql_committed_Transporte WHERE data._idMaterial = ?;", [respuestaM[0].metadata.id]);
        
        const respT = await transporte;
        let respuestaT;
        
        if(respT.getResultList().length > 0)
            respuestaT = JSON.parse(JSON.stringify(respT.getResultList(), null, 2));

        //produccion
        if(respuestaM[0].data._idProduccion)
            produccion = qldb.transaccionParamsArray("SELECT * FROM _ql_committed_Produccion WHERE metadata.id = ?;", [respuestaM[0].data._idProduccion]);
        
        const respP = await produccion;
        let respuestaP;
        
        if(respP.getResultList().length > 0)
            respuestaP = JSON.parse(JSON.stringify(respP.getResultList(), null, 2));
            
        //Distribución
        if(respuestaP[0].metadata.id)
            distribucion = qldb.transaccionParamsArray("SELECT * FROM _ql_committed_Distribucion WHERE data.idProduccion = ? AND data.idDistribucion = '1';", [respuestaP[0].metadata.id]);
    
        const respDn = await distribucion;
        let respuestaDn;
        
        if(respDn.getResultList().length > 0)
            respuestaDn = JSON.parse(JSON.stringify(respDn.getResultList(), null, 2));

        //Distribuidor
        if(respuestaDn[0].metadata.id)
            distribuidor = qldb.transaccionParamsArray("select * from _ql_committed_Distribuidor where data.idDistribucion = ?;", [respuestaDn[0].metadata.id]);
    
        const respDr = await distribuidor;
        let respuestaDr;
        
        if(respDr.getResultList().length > 0)
            respuestaDr = JSON.parse(JSON.stringify(respDr.getResultList(), null, 2));

        //Tequila
        if(respuestaDr[0].metadata.id)
            tequila = qldb.transaccionParamsArray("select * from _ql_committed_Tequila where data.idDistribuidor = ?;", [respuestaDr[0].metadata.id]);
    
        const respTq = await tequila;
        let respuestaTq;
        
        if(respTq.getResultList().length > 0)
            respuestaTq = JSON.parse(JSON.stringify(respTq.getResultList(), null, 2));

        res.status(200).json({
            material: respuestaM[0],
            transporte: respuestaT[0],
            produccion: respuestaP[0],
            distribucion: respuestaDn[0],
            distribuidor: respuestaDr[0],
            tequila: respuestaTq[0]
        });
    }
    catch(error) {
        console.log(error);
        
        res.status(404).json({
            msg: error.message
        });
    }
};

const obtenerHistorico = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const head = req.headers.id;
        let tablas;

        if(head)
            tablas = qldb.transaccionParamsArray("SELECT * FROM history( Material ) WHERE metadata.id = ?;", [head]);
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

const obtenerMaterial = async(req = request, res = response) => {
    const qldb = new QLDB();
    const head = req.headers.id;
    let tablas;

    if(head){
        const headers = JSON.parse(head);

        tablas = qldb.transaccionParams("SELECT * FROM _ql_committed_Material where metadata.id = ? OR metadata.id = ?;", [headers.agave, headers.cristal]);
    }
    else
        tablas = qldb.transaccion('SELECT * FROM _ql_committed_Material;');
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

const obtenerMateriales = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const tablas = qldb.transaccion("SELECT * FROM _ql_committed_Material;");
        
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

const crearMaterial = async(req = request, res = response) => {
    try{
        const qldb = new QLDB();
        const body = req.body;
        let tablas;
        
        console.log(body);
        
        if(body)
            tablas = qldb.transaccionParamsObj("INSERT INTO Material ?;", body);
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

const tequila = async(req = request, res = response) => {
    const qldb = new QLDB();
    const head = req.headers.id;
    let tablas;
    
    if(head)
        tablas = qldb.transaccionParams("SELECT * FROM _ql_committed_Tequila where data.ProduccionID = ?;", [head]);
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

const viaje = async(req = request, res = response) => {
    const qldb = new QLDB();
    const head = req.headers.id;
    let tablas;
    
    if(head)
        tablas = qldb.transaccionParams("SELECT * FROM _ql_committed_Viaje where data.idMaterial = ?", [head]);
    else
        tablas = qldb.transaccion('SELECT * FROM _ql_committed_Viaje;');
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

const example = async(req = request, res = response) => {
    res.status(200).json({
        msg: 'Example'
    });
};

export {
    obtenerHistoria,
    obtenerHistorico,
    obtenerMaterial,
    obtenerMateriales,
    crearMaterial,
    tequila,
    viaje,
    example
}