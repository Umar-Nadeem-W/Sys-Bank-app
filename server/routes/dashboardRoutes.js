const express = require('express');
const router = express.Router();
const {
  getSummary,
  getMonthlyExpenses,
  getMonthlySavings,
  getExpenseCategoryTotals,
} = require('../controllers/dashboardController');

router.get('/summary', getSummary);
router.get('/monthly-expenses', getMonthlyExpenses);
router.get('/monthly-savings', getMonthlySavings);
router.get('/expense-categories', getExpenseCategoryTotals);

module.exports = router;
