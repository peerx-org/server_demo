import { Pool, QueryResult, QueryResultRow } from "pg";
import { NexuPostgres } from "nexujs";

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: 5432,
});

export const query = async (
  action: string,
  values?: unknown[]
): Promise<QueryResult<QueryResultRow> | undefined> => {
  const client = await pool.connect();
  try {
    return await client.query(action, values);
  } catch (error) {
    console.log((error as Error).message);
    throw new Error("Database query failed");
  } finally {
    client.release();
  }
};

export const postgresClient = new NexuPostgres(query);
