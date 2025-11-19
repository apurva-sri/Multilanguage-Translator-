// record visits and expose stats for admin UI.
const express = require('express');
const { analyticsVisits, analyticsStats } = require('../controllers/analyticsController');
const router = express.Router();

router.post('/visit', analyticsVisits);
router.get('/stats', analyticsStats);   

module.exports = router;