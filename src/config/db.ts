import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

type QueryResult<T extends pg.QueryResultRow> = pg.QueryResult<T>;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432'),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

export const query = async <T extends Record<string, unknown>>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration });
  return res;
};

export default pool;
