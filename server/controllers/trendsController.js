// controllers/trendsController.js
// Market trends controller

const { pool } = require('../config/db');

// Get all market trends (with optional filters)
exports.getAllTrends = async (req, res) => {
  try {
    const { produce, location, date } = req.query;
    
    let query = 'SELECT * FROM market_trends WHERE 1=1';
    const params = [];
    
    if (produce) {
      query += ' AND produce_name LIKE ?';
      params.push(`%${produce}%`);
    }
    
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }
    
    if (date) {
      query += ' AND DATE(recorded_date) = ?';
      params.push(date);
    }
    
    query += ' ORDER BY recorded_date DESC';
    
    const [trends] = await pool.query(query, params);
    res.json(trends);
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get trends for specific produce
exports.getTrendsByProduce = async (req, res) => {
  try {
    const { produceName } = req.params;
    
    const [trends] = await pool.query(
      'SELECT * FROM market_trends WHERE produce_name LIKE ? ORDER BY recorded_date DESC',
      [`%${produceName}%`]
    );
    
    res.json(trends);
  } catch (error) {
    console.error('Get trends by produce error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get latest trends
exports.getLatestTrends = async (req, res) => {
  try {
    const [trends] = await pool.query(
      'SELECT * FROM market_trends ORDER BY recorded_date DESC LIMIT 20'
    );
    
    res.json(trends);
  } catch (error) {
    console.error('Get latest trends error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create/Update trend (Admin only - for now, any authenticated user can add)
exports.createTrend = async (req, res) => {
  try {
    const {
      produce_name,
      location,
      average_price,
      demand_level,
      supply_level,
      recorded_date
    } = req.body;
    
    if (!produce_name || !location || !average_price) {
      return res.status(400).json({ 
        message: 'Please provide produce name, location, and average price' 
      });
    }
    
    const [result] = await pool.query(
      `INSERT INTO market_trends 
      (produce_name, location, average_price, demand_level, supply_level, recorded_date)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        produce_name,
        location,
        average_price,
        demand_level || 'medium',
        supply_level || 'medium',
        recorded_date || new Date()
      ]
    );
    
    res.status(201).json({
      message: 'Market trend created successfully',
      trend_id: result.insertId
    });
  } catch (error) {
    console.error('Create trend error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get trend statistics
exports.getTrendStats = async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(DISTINCT produce_name) as total_products,
        COUNT(DISTINCT location) as total_locations,
        COUNT(*) as total_records,
        AVG(average_price) as avg_price_overall
      FROM market_trends
    `);
    
    const [highDemand] = await pool.query(
      'SELECT COUNT(*) as count FROM market_trends WHERE demand_level = "high"'
    );
    
    res.json({
      ...stats[0],
      high_demand_count: highDemand[0].count
    });
  } catch (error) {
    console.error('Get trend stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};