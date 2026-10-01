import { Request, Response } from 'express';
import db from '../db';
import { generateCampaignStrategy } from '../services/aiService';

export const getCampaigns = (req: Request, res: Response) => {
  db.all('SELECT * FROM campaigns ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch campaigns' });
    } else {
      res.json(rows);
    }
  });
};

export const createCampaign = async (req: Request, res: Response) => {
  const campaignData = req.body;
  const { type, name, goal, budget, target_location, target_age, target_audience, website_url, post_url, engagement_type, call_to_action, placements } = campaignData;
  const campaignName = name || `Unnamed ${type} Campaign`;

  try {
    // 1. Generate the AI Strategy
    console.log("Generating AI Strategy...");
    const aiStrategy = await generateCampaignStrategy(campaignData);
    console.log("AI Strategy generated successfully!");

    // 2. Save everything to the database
    const placementsStr = placements ? JSON.stringify(placements) : null;
    
    // We'll alter the table dynamically just in case ai_strategy column doesn't exist
    db.run("ALTER TABLE campaigns ADD COLUMN ai_strategy TEXT", (err) => {
      // Ignore error if column already exists
      
      const query = `
        INSERT INTO campaigns (
          type, name, goal, budget, target_location, target_age, 
          target_audience, website_url, post_url, engagement_type, 
          call_to_action, placements, ai_strategy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(query, [
        type, campaignName, goal, budget, target_location, target_age,
        target_audience, website_url, post_url, engagement_type,
        call_to_action, placementsStr, aiStrategy
      ], function(err) {
        if (err) {
          console.error('Error saving campaign:', err);
          res.status(500).json({ error: 'Failed to save campaign' });
        } else {
          res.status(201).json({ 
            message: 'Campaign created and AI Strategy generated successfully',
            id: this.lastID,
            strategy: aiStrategy
          });
        }
      });
    });
  } catch (error: any) {
    console.error('Controller Error:', error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
