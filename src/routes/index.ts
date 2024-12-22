import express, {Request, Response} from 'express';
import { addTrend, getTrends, getTrendsByCategory, searchTrends, updateTrend, deleteTrend, getTrendsPaginated } from '../services/trendService.js';
import { body, validationResult } from 'express-validator';


const router = express.Router();

// Add a new trend
router.post('/trends', [
    body('keyword').isString().notEmpty().withMessage('Keyword is required and must be a string'),
    body('popularity_score')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Popularity score must be a positive integer'),
  ], async (req: Request, res: Response): Promise<any> => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { keyword, category, popularity_score, source } = req.body;

  try {
    const trend = await addTrend(keyword, category, popularity_score, source);
    res.status(201).json(trend);
  } catch (error) {
    console.error('Error adding trend:', error);
    res.status(500).json({ error: 'Failed to add trend' });
  }
});

// Get all trends
router.get('/trends', async (_req, res) => {
  try {
    const trends = await getTrends();
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Get trends by category
router.get('/trends/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const trends = await getTrendsByCategory(category);
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error fetching trends by category:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Search trends by keyword
router.get('/trends/search/:keyword', async (req, res) => {
  const { keyword } = req.params;

  try {
    const trends = await searchTrends(keyword);
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error searching trends:', error);
    res.status(500).json({ error: 'Failed to search trends' });
  }
});

// Update a trend
router.put('/trends/:id', async (req, res) => {
  const { id } = req.params;
  const { keyword, category, popularity_score, source } = req.body;

  try {
    const updatedTrend = await updateTrend(
      parseInt(id, 10),
      keyword,
      category,
      popularity_score,
      source
    );
    if (!updatedTrend) {
      res.status(404).json({ error: 'Trend not found' });
    } else {
      res.status(200).json(updatedTrend);
    }
  } catch (error) {
    console.error('Error updating trend:', error);
    res.status(500).json({ error: 'Failed to update trend' });
  }
});


// Delete a trend
router.delete('/trends/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTrend = await deleteTrend(parseInt(id, 10));
    if (!deletedTrend) {
      res.status(404).json({ error: 'Trend not found' });
    } else {
      res.status(200).json({ message: 'Trend deleted successfully', trend: deletedTrend });
    }
  } catch (error) {
    console.error('Error deleting trend:', error);
    res.status(500).json({ error: 'Failed to delete trend' });
  }
});

router.get('/trends/paginated', async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;

  try {
    const trends = await getTrendsPaginated(parseInt(limit as string, 10), parseInt(offset as string, 10));
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error fetching paginated trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});




export default router;
