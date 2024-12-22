import { query } from "../config/db.js"; 

export const addTrend = async (
  keyword: string,
  category: string | null,
  popularity_score: number | null,
  source: string | null,
)  => {
  const sql = `
    INSERT INTO trends (keyword, category, popularity_score, source)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await query(sql, [
    keyword,
    category,
    popularity_score,
    source,
  ]);
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
  source?: string,
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
  const result = await query(sql, [
    id,
    keyword,
    category,
    popularity_score,
    source,
  ]);
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

export const getPopularTrends = async (limit: number) => {
  const sql = `
    SELECT * FROM trends
    ORDER BY popularity_score DESC NULLS LAST
    LIMIT $1;
  `;
  const result = await query(sql, [limit]);
  return result.rows;
};

export const getTrendById = async (id: number) => {
  const sql = `SELECT * FROM trends WHERE id = $1;`;
  const result = await query(sql, [id]);
  return result.rows[0];
};

export const filterTrends = async (
  category?: string,
  source?: string,
  minPopularity?: number,
) => {
  const conditions = [];
  const params: (string | number)[] = [];

  if (category) {
    conditions.push("category = $" + (conditions.length + 1));
    params.push(category);
  }
  if (source) {
    conditions.push("source = $" + (conditions.length + 1));
    params.push(source);
  }
  if (minPopularity) {
    conditions.push("popularity_score >= $" + (conditions.length + 1));
    params.push(minPopularity);
  }

  const sql = `
    SELECT * FROM trends
    ${conditions.length ? "WHERE " + conditions.join(" AND ") : ""}
    ORDER BY created_at DESC;
  `;
  const result = await query(sql, params);
  return result.rows;
};

export const getTrendsStatistics = async () => {
  const sql = `
    SELECT
      COUNT(*) AS total_trends,
      AVG(popularity_score) AS average_score
    FROM trends;
  `;
  const result = await query(sql);
  return result.rows[0];
};

export const generateMockTrends = async (count: number) => {
  const mockData = [];
  for (let i = 0; i < count; i++) {
    mockData.push([
      `Keyword ${i + 1}`,
      i % 2 === 0 ? "tech" : "gaming",
      Math.floor(Math.random() * 100),
      i % 3 === 0 ? "YouTube" : "Twitter",
    ]);
  }

  const sql = `
    INSERT INTO trends (keyword, category, popularity_score, source)
    VALUES ${mockData.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(", ")}
  `;
  await query(sql, mockData.flat());
};
