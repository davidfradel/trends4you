import express, { Request, Response } from "express";
import { ValidationError } from "express-validator";
import {
  addTrend,
  getTrends,
  getTrendsByCategory,
  searchTrends,
  updateTrend,
  deleteTrend,
  getTrendsPaginated,
  getPopularTrends,
  getTrendById,
  filterTrends,
  getTrendsStatistics,
  generateMockTrends,
} from "../services/trendService.js";
import { body, validationResult } from "express-validator";
import { Trend } from "../types/trend.type.js";

const router = express.Router();

export type ErrorValidationResponse = {
  errors: ValidationError[];
};

export type ErrorServerResponse = {
  error: string;
};

export type EmptyResponse = Record<string, unknown>;
export type TrendResponse = Trend | ErrorValidationResponse | ErrorServerResponse | EmptyResponse;

// Add a new trend
router.post(
  "/trends",
  [
    body("keyword")
      .isString()
      .notEmpty()
      .withMessage("Keyword is required and must be a string"),
    body("popularity_score")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Popularity score must be a positive integer"),
  ],
  async (req: Request, res: Response<TrendResponse>): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { keyword, category, popularity_score, source } = req.body;

    try {
      const trend = await addTrend(keyword, category, popularity_score, source);
      res.status(201).json(trend);
    } catch (error) {
      console.error("Error adding trend:", error);
      res.status(500).json({ error: "Failed to add trend" });
    }
  },
);

// Get all trends
router.get("/trends", async (_req, res) => {
  try {
    const trends = await getTrends();
    res.status(200).json(trends);
  } catch (error) {
    console.error("Error fetching trends:", error);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// Get trends by category
router.get("/trends/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const trends = await getTrendsByCategory(category);
    res.status(200).json(trends);
  } catch (error) {
    console.error("Error fetching trends by category:", error);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// Search trends by keyword
router.get("/trends/search/:keyword", async (req, res) => {
  const { keyword } = req.params;

  try {
    const trends = await searchTrends(keyword);
    res.status(200).json(trends);
  } catch (error) {
    console.error("Error searching trends:", error);
    res.status(500).json({ error: "Failed to search trends" });
  }
});

// Update a trend
router.put("/trends/:id", async (req, res) => {
  const { id } = req.params;
  const { keyword, category, popularity_score, source } = req.body;

  try {
    const updatedTrend = await updateTrend(
      parseInt(id, 10),
      keyword,
      category,
      popularity_score,
      source,
    );
    if (!updatedTrend) {
      res.status(404).json({ error: "Trend not found" });
    } else {
      res.status(200).json(updatedTrend);
    }
  } catch (error) {
    console.error("Error updating trend:", error);
    res.status(500).json({ error: "Failed to update trend" });
  }
});

// Delete a trend
router.delete("/trends/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTrend = await deleteTrend(parseInt(id, 10));
    if (!deletedTrend) {
      res.status(404).json({ error: "Trend not found" });
    } else {
      res
        .status(200)
        .json({ message: "Trend deleted successfully", trend: deletedTrend });
    }
  } catch (error) {
    console.error("Error deleting trend:", error);
    res.status(500).json({ error: "Failed to delete trend" });
  }
});

// Get paginated trends
router.get("/trends/paginated", async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;

  try {
    const trends = await getTrendsPaginated(
      parseInt(limit as string, 10),
      parseInt(offset as string, 10),
    );
    res.status(200).json(trends);
  } catch (error) {
    console.error("Error fetching paginated trends:", error);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// Get popular trends
router.get("/trends/popular", async (req, res) => {
  const { limit = 10 } = req.query;

  try {
    const popularTrends = await getPopularTrends(parseInt(limit as string, 10));
    res.status(200).json(popularTrends);
  } catch (error) {
    console.error("Error fetching popular trends:", error);
    res.status(500).json({ error: "Failed to fetch popular trends" });
  }
});

// Get trend by ID
router.get("/trends/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const trend = await getTrendById(parseInt(id, 10));
    if (!trend) {
      res.status(404).json({ error: "Trend not found" });
    } else {
      res.status(200).json(trend);
    }
  } catch (error) {
    console.error("Error fetching trend by ID:", error);
    res.status(500).json({ error: "Failed to fetch trend" });
  }
});

// Filter trends by category, source, and/or minimum popularity score
router.get("/trends/filter", async (req, res) => {
  const { category, source, minPopularity } = req.query;

  try {
    const trends = await filterTrends(
      category as string,
      source as string,
      minPopularity ? parseInt(minPopularity as string, 10) : undefined,
    );
    res.status(200).json(trends);
  } catch (error) {
    console.error("Error filtering trends:", error);
    res.status(500).json({ error: "Failed to filter trends" });
  }
});

// Get trends statistics
router.get("/trends/statistics", async (req, res) => {
  try {
    const stats = await getTrendsStatistics();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Generate mock trends
router.post("/trends/mock", async (req, res) => {
  const { count = 10 } = req.body;

  try {
    await generateMockTrends(parseInt(count, 10));
    res
      .status(201)
      .json({ message: `${count} mock trends generated successfully` });
  } catch (error) {
    console.error("Error generating mock trends:", error);
    res.status(500).json({ error: "Failed to generate mock trends" });
  }
});

export default router;
