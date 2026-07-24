const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint de usuarios con validación segura
app.get('/users', (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;
  
  if (name && typeof name !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid name parameter',
      code: 'VALIDATION_ERROR'
    });
  }
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1 || limitNum > 100) {
    return res.status(400).json({
      error: 'Invalid pagination parameters',
      code: 'VALIDATION_ERROR'
    });
  }
  
  const users = [];
  for (let i = 0; i < Math.min(limitNum, 5); i++) {
    users.push({
      id: i + 1,
      name: name ? `${name}_${i}` : `user_${i}`,
      email: `user${i}@example.com`
    });
  }
  
  res.json({
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: 100
    }
  });
});

// ❌ VULNERABILIDAD INTENCIONAL para que Semgrep la detecte
app.get('/legacy-search', (req, res) => {
  const { query } = req.query;
  try {
    const result = eval(query);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: 'Invalid query' });
  }
});

module.exports = app;