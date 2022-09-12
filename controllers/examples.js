import { response, request } from 'express';
import QLDB from '../database/config.js';

const material = async(req = request, res = response) => {
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

const produccion = async(req = request, res = response) => {
    const qldb = new QLDB();
    const head = req.headers.id;
    let tablas;
    
    if(head)
        tablas = qldb.transaccionParams("SELECT * FROM _ql_committed_Produccion where metadata.id = ?", [head]);
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
    material,
    produccion,
    tequila,
    viaje,
    example
}