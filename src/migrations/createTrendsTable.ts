import { query } from "../config/db.js";

const createTrendsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS trends (
      id SERIAL PRIMARY KEY,
      keyword VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      popularity_score INTEGER,
      source VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(sql);
    console.log('Table "trends" created successfully');
  } catch (error) {
    console.error('Error creating table "trends":', error);
  }
};

createTrendsTable();
