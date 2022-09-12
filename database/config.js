import { RetryConfig, QldbDriver } from 'amazon-qldb-driver-nodejs';

class QLDB {
    constructor(retryLimit = 4, maxConcurrentTransactions = 10) {
        this.retryLimit = retryLimit;
        this.maxConcurrentTransactions = maxConcurrentTransactions;
        this.retryConfig = new RetryConfig(this.retryLimit);
        this.qldbDriver = new QldbDriver(process.env.LEDGER, {}, this.maxConcurrentTransactions, this.retryConfig);
    }
    
    async getTablas() {
        return await this.qldbDriver.getTableNames();
    }

    async transaccion(transaccion) {
        return await this.qldbDriver.executeLambda(async(txn) => {
            const respuesta = await txn.execute(transaccion);
            return respuesta;
        });
    }

    async transaccionParams(transaccion, params) {
        return await this.qldbDriver.executeLambda(async(txn) => {
            const respuesta = await txn.execute(transaccion, ...params);
            return respuesta;
        });
    }

    close() {
        this.qldbDriver.close();
    }
}

export default QLDB;