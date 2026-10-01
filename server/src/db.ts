import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create the campaigns table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        goal TEXT NOT NULL,
        budget INTEGER NOT NULL,
        target_location TEXT,
        target_age TEXT,
        target_audience TEXT,
        website_url TEXT,
        post_url TEXT,
        engagement_type TEXT,
        call_to_action TEXT,
        placements TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating campaigns table:', err.message);
      } else {
        console.log('Campaigns table ready.');
      }
    });
  }
});

export default db;
