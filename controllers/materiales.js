import { response, request } from 'express';
import QLDB from '../database/config.js';

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
/*
            const amChart = [];
            amChart.push({
                "name": respuesta[0].metadata.id,
                "valorPropio": "Id de bloque",
                "value": 1,
                "children":
                    respuesta.map(respQLDB => {
                        return {
                            "name": `Versión`, 
                            "valorPropio": respQLDB.metadata.version,
                            "value": 0.75,
                            "collapsed": false,
                            "children": [
                                {
                                "name": "Nombre",
                                "value": 0.5,
                                "valorPropio": respQLDB.data.Nombre
                                },
                                {
                                "name": "Fecha de Recolección",
                                "value": 0.5,
                                "valorPropio": respQLDB.data.FechaRecoleccion
                                },
                                {
                                "name": "Cantidad",
                                "value": 0.5,
                                "valorPropio": respQLDB.data.Cantidad
                                },
                                {
                                "name": "Origen",
                                "value": 0.5,
                                "valorPropio": respQLDB.data.Origen
                                },
                                {
                                "name": "Lote",
                                "value": 0.5,
                                "valorPropio": respQLDB.data.Lote
                                }
                            ]
                        }
                    })
            });
            */
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
/*
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
    obtenerHistorico,
    obtenerMaterial,
    obtenerMateriales,
    crearMaterial,
    tequila,
    viaje,
    example
}