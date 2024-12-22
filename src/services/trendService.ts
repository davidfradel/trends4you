import { query } from '../config/db.js';

export const addTrend = async (
  keyword: string,
  category: string | null,
  popularity_score: number | null,
  source: string | null
) => {
  const sql = `
    INSERT INTO trends (keyword, category, popularity_score, source)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await query(sql, [keyword, category, popularity_score, source]);
  return result.rows[0];
};

export const getTrends = async () => {
  const sql = `SELECT * FROM trends ORDER BY created_at DESC;`;
  const result = await query(sql);
  return result.rows;
};

export const getTrendsByCategory = async (category: string) => {
  const sql = `SELECT * FROM trends WHERE category = $1 ORDER BY created_at DESC;`;
  const result = await query(sql, [category]);
  return result.rows;
};

export const searchTrends = async (keyword: string) => {
  const sql = `
    SELECT * FROM trends
    WHERE keyword ILIKE $1
    ORDER BY created_at DESC;
  `;
  const result = await query(sql, [`%${keyword}%`]);
  return result.rows;
};

export const updateTrend = async (
  id: number,
  keyword?: string,
  category?: string,
  popularity_score?: number,
  source?: string
) => {
  const sql = `
    UPDATE trends
    SET
      keyword = COALESCE($2, keyword),
      category = COALESCE($3, category),
      popularity_score = COALESCE($4, popularity_score),
      source = COALESCE($5, source)
    WHERE id = $1
    RETURNING *;
  `;
  const result = await query(sql, [id, keyword, category, popularity_score, source]);
  return result.rows[0];
};


export const deleteTrend = async (id: number) => {
  const sql = `
    DELETE FROM trends WHERE id = $1 RETURNING *;
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
};

export const getTrendsPaginated = async (limit: number, offset: number) => {
  const sql = `
    SELECT * FROM trends
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;
  `;
  const result = await query(sql, [limit, offset]);
  return result.rows;
};


