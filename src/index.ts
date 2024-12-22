import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", router);

app.get("/", (req, res) => {
  res.send("Welcome to Trends4You API!");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "success", time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
