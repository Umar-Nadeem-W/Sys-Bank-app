const { monthlyExpenses, monthlySavings, expenseCategoryTotals, user } = require('../models/dummyData');

const getSummary = (req, res) => {
  const totalExpenses = monthlyExpenses.reduce((sum, row) => {
    const { month, ...cats } = row;
    return sum + Object.values(cats).reduce((a, b) => a + b, 0);
  }, 0);

  const currentSavings = monthlySavings[monthlySavings.length - 1].balance;

  res.json({
    user,
    totalExpenses,
    currentSavings,
    monthlyIncome: 5500,
  });
};

const getMonthlyExpenses = (req, res) => {
  res.json(monthlyExpenses);
};

const getMonthlySavings = (req, res) => {
  res.json(monthlySavings);
};

const getExpenseCategoryTotals = (req, res) => {
  const data = Object.entries(expenseCategoryTotals).map(([name, value]) => ({ name, value }));
  res.json(data);
};

module.exports = { getSummary, getMonthlyExpenses, getMonthlySavings, getExpenseCategoryTotals };
