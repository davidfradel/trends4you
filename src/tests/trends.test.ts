import request from 'supertest';
import app from '../index.js';
 
describe('Trends API', () => {
  let trendId: number;
  it('should create a new trend', async () => {
    const newTrend = {
      keyword: 'AI tools',
      category: 'tech',
      popularity_score: 85,
      source: 'YouTube',
    };

    const response = await request(app)
      .post('/trends')
      .send(newTrend);
    trendId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.keyword).toBe(newTrend.keyword);
  });

  it('should fetch all trends', async () => {
    const response = await request(app).get('/trends');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch trends by category', async () => {
    const category = 'tech';
    const response = await request(app).get(`/trends/${category}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0].category).toBe(category);
    }
  });

  it('should fetch a trend by ID', async () => { 
    const response = await request(app).get(`/trends/${trendId}`);
    expect(response.body).toHaveProperty('id', trendId);
  });

  it('should delete a trend by ID', async () => {
    const response = await request(app).delete(`/trends/${trendId}`);
    expect(response.body).toHaveProperty('message', 'Trend deleted successfully');
  });
});
