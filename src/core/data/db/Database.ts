import { Client, QueryResult } from 'pg';
import Base from '../../structures/Base';

export default class Database extends Base{
    #client: Client;

    public async connect() {
        this.#client = new Client({
            user: 'postgres',
            password: process.env.DB_PASS,
            database: "botdb"
        });
        try {
            await this.#client.connect();
            this.logger.success('Successfully connected to database');
        } catch (e) {
            this.logger.error(`Failed to connect to database: ${e.message}`)
        }

        try {
            await this.#client.query("create database botdb").catch(_ => this.logger.notice('Already created database'));
            await this.#client.query(`create table if not exists messages (
                id varchar,
                authorID varchar,
                channelID varchar,
                guildID varchar,
                content text,
                attachment text
            );`)
            await this.#client.query(`create table if not exists backups (
                guildID varchar,
                jsonString text
            )`)
            await this.#client.query(`create table if not exists automodConfig (
                guildID varchar,
                badWords varchar,
                badWordsP varchar,
                spamP varchar
            )`)
        } catch (err) {
            this.logger.error(`Failed to execute SQL Query: ${err.message}`)
        }
    }

    public async query(q: string, ...values: any[]): Promise<QueryResult> {
        const res = await this.#client.query(q, values);
        // this.logger.notice(`Executed SQL Query: ${q}`);
        return res;
    }
}