import mysql from 'mysql2/promise';
import 'dotenv/config';
import { generateError } from '../helpers/generateError.js';

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool;
let poolPromise;

const getConnection = async () => {
    try {
        if (!pool) {
            if (!poolPromise) {
                poolPromise = (async () => {
                    const initPool = mysql.createPool({
                        host: MYSQL_HOST,
                        user: MYSQL_USER,
                        password: MYSQL_PASSWORD,
                    });

                    await initPool.query(
                        `CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}`
                    );
                    await initPool.end();

                    pool = mysql.createPool({
                        host: MYSQL_HOST,
                        user: MYSQL_USER,
                        password: MYSQL_PASSWORD,
                        database: MYSQL_DATABASE,
                        timezone: 'Z',
                    });
                    return pool;
                })().catch((err) => {
                    poolPromise = null;
                    throw err;
                });
            }
            await poolPromise;
        }
        return pool;
    } catch (err) {
        console.error(err);
        throw generateError(`Conexión fallida ${err.message}`, 502);
    }
};
export default getConnection;
