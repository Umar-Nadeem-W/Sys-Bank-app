const express = require('express');
const router = express.Router();
const {
  getSummary,
  getMonthlyExpenses,
  getMonthlySavings,
  getExpenseCategoryTotals,
  getPredictivePlan,
} = require('../controllers/dashboardController');

router.get('/summary', getSummary);
router.get('/monthly-expenses', getMonthlyExpenses);
router.get('/monthly-savings', getMonthlySavings);
router.get('/expense-categories', getExpenseCategoryTotals);
router.get('/predictive', getPredictivePlan);

module.exports = router;
