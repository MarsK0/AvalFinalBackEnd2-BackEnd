import { DataSource } from "typeorm";
import { dataSource } from "./data-source-config";

const database = {
    client: null as unknown as DataSource,

    async connect(): Promise<void> {
        this.client = dataSource
        await this.client.initialize()
    },

    async disconnect(): Promise<void> {
        await this.client.destroy()
        this.client = null as any
    }
}

export default database
